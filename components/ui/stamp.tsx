import { cn } from "@/lib/cn";

type StampProps = {
  label: string;
  tone?: "red" | "navy" | "gold";
  rotate?: number;
  className?: string;
};

const tones = {
  red: "border-air-red/40 bg-air-red/8 text-air-red",
  navy: "border-navy/20 bg-navy/6 text-navy",
  gold: "border-gold/50 bg-gold/10 text-navy",
};

export function Stamp({
  label,
  tone = "red",
  className,
}: StampProps) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center justify-center rounded-full border px-3 py-1 text-center text-[10px] font-medium tracking-[0.2em] uppercase",
        tones[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
