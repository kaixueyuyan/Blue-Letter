import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  kicker?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  kicker,
  align = "left",
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] font-medium tracking-[0.32em] text-gold uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-pretty text-ink sm:text-5xl">
        {title}
      </h2>
      {kicker ? (
        <p className="mt-4 text-base leading-8 text-ink-soft sm:text-lg">{kicker}</p>
      ) : null}
    </header>
  );
}
