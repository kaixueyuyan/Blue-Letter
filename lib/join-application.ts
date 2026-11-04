export type JoinPath = "volunteer" | "organization";

const formIdPattern = /^[a-zA-Z0-9]{4,64}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isFormspreeId(value: string | undefined): value is string {
  return typeof value === "string" && formIdPattern.test(value);
}

function text(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

function checked(data: FormData, name: string) {
  return data.get(name) === "yes";
}

export function validateJoinApplication(path: JoinPath, data: FormData) {
  const errors: Record<string, string> = {};

  const requireText = (name: string, id: string, message: string, max = 2000) => {
    const value = text(data, name);
    if (!value) errors[id] = message;
    else if (value.length > max) errors[id] = "Use a shorter answer.";
  };

  const requireEmail = (id: string) => {
    const value = text(data, "email");
    if (!value) errors[id] = "Enter an email address.";
    else if (!emailPattern.test(value) || value.length > 200) {
      errors[id] = "Enter a valid email address.";
    }
  };

  if (path === "volunteer") {
    requireText("preferredName", "preferred-name", "Enter a preferred name.", 120);
    requireEmail("email");
    requireText("region", "region", "Enter a country or region.", 120);
    if (!checked(data, "ageEligible")) {
      errors["age-18"] = "Confirm that you are 18 or older.";
    }
    requireText("languages", "languages", "List the languages you speak.", 200);
    requireText("why", "why", "Tell us why you would like to join.");
  } else {
    requireText("organizationName", "organization-name", "Enter the organization name.", 160);
    requireText("contactName", "contact-name", "Enter the contact person's name.", 120);
    requireEmail("work-email");
    requireText("region", "org-region", "Enter a country or region.", 120);
    requireText("organizationType", "organization-type", "Select an organization type.", 80);
    requireText("collaboration", "collaboration", "Describe the collaboration you have in mind.");
  }

  const consentId = path === "volunteer" ? "volunteer-consent" : "organization-consent";
  if (!checked(data, "consent")) {
    errors[consentId] = "Confirm that we may contact you about this application.";
  }

  return errors;
}

export async function submitJoinApplication(formId: string, data: FormData) {
  if (!isFormspreeId(formId)) {
    return { ok: false as const, message: "This form is not ready to send yet." };
  }

  if (text(data, "_gotcha")) {
    return { ok: true as const };
  }

  let response: Response;
  try {
    response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });
  } catch {
    return {
      ok: false as const,
      message: "The form could not be sent. Check your connection and try again.",
    };
  }

  if (response.ok) return { ok: true as const };

  if (response.status === 429) {
    return {
      ok: false as const,
      message: "Too many forms were sent just now. Wait a little while and try again.",
    };
  }

  const message = await formspreeError(response);
  return { ok: false as const, message };
}

async function formspreeError(response: Response) {
  try {
    const payload = (await response.json()) as { errors?: Array<{ message?: string }> };
    const messages = (payload.errors ?? [])
      .map((error) => error.message?.trim())
      .filter((message): message is string => Boolean(message))
      .slice(0, 3);
    if (messages.length > 0) return messages.join(" ");
  } catch {
    // Formspree sometimes returns a non-JSON error page.
  }
  return "The form could not be sent. Wait a moment and try again.";
}
