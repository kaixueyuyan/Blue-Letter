import { cn } from "@/lib/cn";
import Link from "next/link";

function isHash(href: string) {
  return href.startsWith("#");
}

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "onDark";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[12px] font-medium tracking-[0.18em] uppercase transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold";

  const variants = {
    primary:
      "bg-navy text-ivory shadow-[0_16px_32px_-18px_rgba(11,28,61,0.85)] hover:bg-air-blue",
    secondary:
      "border border-ink/15 bg-paper/70 text-ink backdrop-blur-sm hover:border-gold hover:text-navy",
    onDark:
      "bg-ivory text-navy hover:bg-paper",
  };

  const classes = cn(base, variants[variant], className);

  if (isHash(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
