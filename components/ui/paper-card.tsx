import { cn } from "@/lib/cn";

type PaperCardProps = {
  children: React.ReactNode;
  className?: string;
  ruled?: boolean;
};

export function PaperCard({ children, className, ruled = false }: PaperCardProps) {
  return (
    <article
      className={cn(
        "surface-lift relative overflow-hidden rounded-[1.6rem] border border-ink/8 bg-paper",
        ruled && "bg-[linear-gradient(to_bottom,transparent_31px,rgba(11,28,61,0.05)_31px,rgba(11,28,61,0.05)_32px)] bg-[length:100%_32px]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
      />
      {children}
    </article>
  );
}
