import { cn } from "@/lib/cn";
import type { LogbookVisual } from "@/lib/logbook";

const palettes: Record<LogbookVisual, string> = {
  crate: "from-navy via-wax/80 to-air-red/70",
  second: "from-navy via-air-blue to-gold/70",
  timetable: "from-ink via-navy to-moss/80",
  kitchen: "from-wax via-air-red/70 to-gold/60",
  relay: "from-moss via-navy to-gold/50",
  capsule: "from-navy via-ink to-gold/40",
  field: "from-moss/90 via-navy to-gold/50",
  phrase: "from-air-red/80 via-navy to-ivory/20",
};

const marks: Record<LogbookVisual, string> = {
  crate: "口",
  second: "1″",
  timetable: "⇄",
  kitchen: "◎",
  relay: "¶",
  capsule: "▣",
  field: "✦",
  phrase: "あ",
};

export function StoryVisual({
  visual,
  title,
  className,
}: {
  visual: LogbookVisual;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        palettes[visual],
        className,
      )}
      role="img"
      aria-label={`Editorial placeholder for ${title}. No identifying photographs.`}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#fffdf8_0%,transparent_42%)]"
      />
      <span
        aria-hidden
        className="absolute -right-8 -bottom-10 font-display text-[7rem] leading-none text-ivory/15"
      >
        {marks[visual]}
      </span>
      <div className="relative flex h-full min-h-[12rem] flex-col justify-between p-5 sm:p-6">
        <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
          Demo plate · not a portrait
        </p>
        <p className="max-w-[16rem] font-display text-2xl leading-tight text-ivory sm:text-3xl">
          {title}
        </p>
      </div>
    </div>
  );
}
