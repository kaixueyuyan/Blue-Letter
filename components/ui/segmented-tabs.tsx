"use client";

import { cn } from "@/lib/cn";
import { useLayoutEffect, useRef, useState } from "react";

export type SegmentedTab = {
  id: string;
  label: string;
  href?: string;
};

type SegmentedTabsProps = {
  items: SegmentedTab[];
  value: string;
  onChange?: (id: string) => void;
  className?: string;
  tone?: "light" | "onGlass";
};

export function SegmentedTabs({
  items,
  value,
  onChange,
  className,
  tone = "light",
}: SegmentedTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 4, width: 0, height: 0, top: 4 });

  useLayoutEffect(() => {
    const measure = () => {
      const active = itemRefs.current.get(value);
      if (!active) return;
      setIndicator({
        left: active.offsetLeft,
        width: active.offsetWidth,
        height: active.offsetHeight,
        top: active.offsetTop,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value, items]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(
        "relative isolate flex items-center rounded-full p-1",
        tone === "light" &&
          "bg-ink/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
        tone === "onGlass" &&
          "bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(11,28,61,0.06)] backdrop-blur-md",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-navy shadow-[0_8px_24px_-12px_rgba(11,28,61,0.7)] transition-[left,top,width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          left: indicator.left,
          top: indicator.top,
          width: indicator.width,
          height: indicator.height || undefined,
        }}
      />
      {items.map((item) => {
        const selected = item.id === value;
        const classes = cn(
          "relative z-10 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
          selected ? "text-ivory" : "text-ink-soft hover:text-ink",
        );

        const bindRef = (node: HTMLElement | null) => {
          if (node) itemRefs.current.set(item.id, node);
          else itemRefs.current.delete(item.id);
        };

        if (item.href) {
          return (
            <a
              key={item.id}
              ref={bindRef}
              href={item.href}
              role="tab"
              aria-selected={selected}
              className={classes}
              onClick={() => onChange?.(item.id)}
            >
              {item.label}
            </a>
          );
        }

        return (
          <button
            key={item.id}
            ref={bindRef}
            type="button"
            role="tab"
            aria-selected={selected}
            className={classes}
            onClick={() => onChange?.(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
