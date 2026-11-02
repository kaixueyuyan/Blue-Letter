"use client";

import { CompassRose } from "@/components/ui/world-map";
import { cn } from "@/lib/cn";
import { logbookStories, type LogbookStory } from "@/lib/logbook";
import { getLibraryMission } from "@/lib/mission-library";
import { projectAtlasPoint } from "@/lib/world-atlas-project";
import {
  WORLD_ATLAS_COUNTRIES,
  WORLD_ATLAS_GRATICULE,
  WORLD_ATLAS_HEIGHT,
  WORLD_ATLAS_LAKES,
  WORLD_ATLAS_LAND,
  WORLD_ATLAS_SPHERE,
  WORLD_ATLAS_WIDTH,
} from "@/lib/world-atlas";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

const INITIAL_VIEW: AtlasView = { zoom: 1, x: 0, y: 0 };
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const CLUSTER_SCREEN_GAP = 48;

type AtlasView = { zoom: number; x: number; y: number };

type MapPin = {
  id: string;
  stories: LogbookStory[];
  x: number;
  y: number;
};

function clampPan(x: number, y: number, zoom: number) {
  if (zoom <= 1.001) return { x: 0, y: 0 };
  const limitX = ((zoom - 1) * WORLD_ATLAS_WIDTH) / 2;
  const limitY = ((zoom - 1) * WORLD_ATLAS_HEIGHT) / 2;
  return {
    x: Math.min(limitX, Math.max(-limitX, x)),
    y: Math.min(limitY, Math.max(-limitY, y)),
  };
}

function toScreen(x: number, y: number, view: AtlasView) {
  const cx = WORLD_ATLAS_WIDTH / 2;
  const cy = WORLD_ATLAS_HEIGHT / 2;
  return {
    x: view.zoom * (x - cx) + cx + view.x,
    y: view.zoom * (y - cy) + cy + view.y,
  };
}

function clusterPins(zoom: number): MapPin[] {
  const points = logbookStories.map((story) => {
    const point = projectAtlasPoint(story.lat, story.lng);
    return { story, x: point.x, y: point.y };
  });
  const threshold = CLUSTER_SCREEN_GAP / zoom;
  const remaining = points.slice();
  const groups: (typeof points)[] = [];
  while (remaining.length > 0) {
    const seed = remaining.shift();
    if (!seed) break;
    const group = [seed];
    for (let index = remaining.length - 1; index >= 0; index -= 1) {
      const candidate = remaining[index];
      const closeToAll = group.every(
        (member) =>
          Math.hypot(member.x - candidate.x, member.y - candidate.y) <= threshold,
      );
      if (!closeToAll) continue;
      group.push(candidate);
      remaining.splice(index, 1);
    }
    groups.push(group);
  }
  return groups.map((group) => ({
    id: group.map((point) => point.story.id).join("-"),
    stories: group.map((point) => point.story),
    x: group.reduce((sum, point) => sum + point.x, 0) / group.length,
    y: group.reduce((sum, point) => sum + point.y, 0) / group.length,
  }));
}

export function ExpeditionMap({
  selectedSlug,
  onSelect,
  onRevealInGallery,
}: {
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  onRevealInGallery: (slug: string) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<AtlasView>(INITIAL_VIEW);
  const viewRef = useRef<AtlasView>(INITIAL_VIEW);
  const frameRefId = useRef<number | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);
  const [view, setView] = useState<AtlasView>(INITIAL_VIEW);
  const [goal, setGoal] = useState<AtlasView>(INITIAL_VIEW);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return () => {
      if (frameRefId.current != null) cancelAnimationFrame(frameRefId.current);
    };
  }, []);

  function paint(next: AtlasView) {
    viewRef.current = next;
    setView(next);
  }

  function settle() {
    if (frameRefId.current != null) cancelAnimationFrame(frameRefId.current);
    const step = () => {
      const goal = targetRef.current;
      const current = viewRef.current;
      if (reducedMotion.current) {
        paint(goal);
        frameRefId.current = null;
        return;
      }
      const zoom = current.zoom + (goal.zoom - current.zoom) * 0.22;
      const x = current.x + (goal.x - current.x) * 0.22;
      const y = current.y + (goal.y - current.y) * 0.22;
      const settled =
        Math.abs(zoom - goal.zoom) < 0.01 &&
        Math.abs(x - goal.x) < 0.35 &&
        Math.abs(y - goal.y) < 0.35;
      if (settled) {
        paint(goal);
        frameRefId.current = null;
        return;
      }
      paint({ zoom, x, y });
      frameRefId.current = requestAnimationFrame(step);
    };
    frameRefId.current = requestAnimationFrame(step);
  }

  function commit(next: AtlasView, immediate = false) {
    const pan = clampPan(next.x, next.y, next.zoom);
    const nextGoal = { zoom: next.zoom, x: pan.x, y: pan.y };
    targetRef.current = nextGoal;
    setGoal(nextGoal);
    if (immediate || reducedMotion.current) {
      if (frameRefId.current != null) cancelAnimationFrame(frameRefId.current);
      frameRefId.current = null;
      paint(targetRef.current);
      return;
    }
    if (frameRefId.current == null) settle();
  }

  function zoomAbout(nextZoom: number, focusX: number, focusY: number) {
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    const cx = WORLD_ATLAS_WIDTH / 2;
    const cy = WORLD_ATLAS_HEIGHT / 2;
    const pan = clampPan(
      -(zoom * (focusX - cx)),
      -(zoom * (focusY - cy)),
      zoom,
    );
    commit({ zoom, x: pan.x, y: pan.y });
  }

  const clusterZoom = goal.zoom < 1.2 ? 1 : Math.round(goal.zoom * 2) / 2;
  const pins = useMemo(() => clusterPins(clusterZoom), [clusterZoom]);
  const selected =
    logbookStories.find((story) => story.slug === selectedSlug) ?? null;
  const selectedPin =
    pins.find((pin) => pin.stories.some((story) => story.slug === selectedSlug)) ??
    null;

  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;
    const goal = targetRef.current;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: goal.x,
      panY: goal.y,
      moved: false,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return;
    const dx = ((event.clientX - drag.x) / rect.width) * WORLD_ATLAS_WIDTH;
    const dy = ((event.clientY - drag.y) / rect.height) * WORLD_ATLAS_HEIGHT;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 4) {
      drag.moved = true;
    }
    const zoom = targetRef.current.zoom;
    const pan = clampPan(drag.panX + dx, drag.panY + dy, zoom);
    commit({ zoom, x: pan.x, y: pan.y }, true);
  }

  function onPointerUp(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (!drag.moved) onSelect(null);
  }

  function onFrameKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      onSelect(null);
      return;
    }
    if (event.target !== frameRef.current) return;
    const step = WORLD_ATLAS_WIDTH * 0.08;
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomAbout(targetRef.current.zoom * 1.45, focus.x, focus.y);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoomAbout(targetRef.current.zoom / 1.45, focus.x, focus.y);
    } else if (event.key === "0") {
      event.preventDefault();
      commit({ zoom: 1, x: 0, y: 0 });
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      commit({ ...targetRef.current, x: targetRef.current.x + step });
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      commit({ ...targetRef.current, x: targetRef.current.x - step });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      commit({ ...targetRef.current, y: targetRef.current.y + step });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      commit({ ...targetRef.current, y: targetRef.current.y - step });
    }
  }

  function focusPoint() {
    const story = logbookStories.find((item) => item.slug === selectedSlug);
    if (!story) {
      return { x: WORLD_ATLAS_WIDTH / 2, y: WORLD_ATLAS_HEIGHT / 2 };
    }
    return projectAtlasPoint(story.lat, story.lng);
  }

  const focus = focusPoint();
  const plate = `translate(${WORLD_ATLAS_WIDTH / 2 + view.x} ${WORLD_ATLAS_HEIGHT / 2 + view.y}) scale(${view.zoom}) translate(${-WORLD_ATLAS_WIDTH / 2} ${-WORLD_ATLAS_HEIGHT / 2})`;

  return (
    <section className="surface-lift rounded-[1.6rem] border border-ink/8 bg-[#071325]">
      <div className="flex flex-wrap items-end justify-between gap-4 px-6 pt-6 sm:px-8">
        <div>
          <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
            Expedition atlas · Natural Earth
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ivory">
            Expedition map
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-ivory/65">
          Country outlines from Natural Earth, public domain. Pins mark
          regions, not homes. Zoom in where several notes share a coast.
          Demo locations only.
        </p>
      </div>

      <div className="relative mt-4 px-3 pb-2 sm:px-5">
        <div className="relative">
          <div className="mb-2 flex justify-end gap-1.5">
            <MapControl
              label="Zoom in"
              onClick={() =>
                zoomAbout(targetRef.current.zoom * 1.45, focus.x, focus.y)
              }
            >
              +
            </MapControl>
            <MapControl
              label="Zoom out"
              onClick={() =>
                zoomAbout(targetRef.current.zoom / 1.45, focus.x, focus.y)
              }
            >
              −
            </MapControl>
            <MapControl
              label="Reset map"
              onClick={() => commit({ zoom: 1, x: 0, y: 0 })}
            >
              <span aria-hidden="true" className="text-base leading-none">
                ↺
              </span>
            </MapControl>
          </div>
          <div
            ref={frameRef}
            tabIndex={0}
            onKeyDown={onFrameKeyDown}
            className="relative overflow-hidden rounded-[1.1rem] border border-gold/20 bg-[#050d18] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            style={{ touchAction: view.zoom > 1 ? "none" : "pan-y" }}
          >
            <svg
              viewBox={`0 0 ${WORLD_ATLAS_WIDTH} ${WORLD_ATLAS_HEIGHT}`}
              className={cn(
                "block h-auto w-full",
                view.zoom > 1 && (dragging ? "cursor-grabbing" : "cursor-grab"),
              )}
              role="img"
              aria-label="Geographic world map with fictional expedition markers"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <defs>
                <radialGradient id="expedition-atlas-sea" cx="50%" cy="42%" r="72%">
                  <stop offset="0%" stopColor="#16315c" />
                  <stop offset="55%" stopColor="#0c1c36" />
                  <stop offset="100%" stopColor="#081422" />
                </radialGradient>
                <clipPath id="expedition-atlas-plate">
                  <path d={WORLD_ATLAS_SPHERE} />
                </clipPath>
              </defs>
              <rect
                width={WORLD_ATLAS_WIDTH}
                height={WORLD_ATLAS_HEIGHT}
                fill="#050d18"
              />
              <g clipPath="url(#expedition-atlas-plate)">
              <g transform={plate}>
                <path d={WORLD_ATLAS_SPHERE} fill="url(#expedition-atlas-sea)" />
                <path
                  d={WORLD_ATLAS_GRATICULE}
                  fill="none"
                  stroke="#b89a5c"
                  strokeOpacity="0.22"
                  strokeWidth={0.7 / view.zoom}
                />
                <path d={WORLD_ATLAS_LAND} fill="#e6d7bc" />
                {WORLD_ATLAS_LAKES ? (
                  <path d={WORLD_ATLAS_LAKES} fill="#10233f" />
                ) : null}
                <path
                  d={WORLD_ATLAS_LAND}
                  fill="none"
                  stroke="#c6a56a"
                  strokeLinejoin="round"
                  strokeWidth={1.35 / view.zoom}
                />
                <g
                  fill="none"
                  stroke="#e2c98a"
                  strokeLinejoin="round"
                  strokeOpacity="0.95"
                  strokeWidth={0.8 / view.zoom}
                >
                  {WORLD_ATLAS_COUNTRIES.map((country) => (
                    <path key={country.name} d={country.d}>
                      <title>{country.name}</title>
                    </path>
                  ))}
                </g>
              </g>
              </g>
              <path
                d={WORLD_ATLAS_SPHERE}
                fill="none"
                stroke="#b89a5c"
                strokeOpacity="0.55"
                strokeWidth="1.35"
              />
            </svg>

            <div className="pointer-events-none absolute inset-0">
              {pins.map((pin) => {
                const primary = pin.stories[0];
                const active = pin.stories.some((story) => story.slug === selectedSlug);
                const screen = toScreen(pin.x, pin.y, view);
                const label =
                  pin.stories.length === 1
                    ? `${primary.region}, ${primary.country}`
                    : `${pin.stories.length} field notes in ${primary.country}`;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    className="pointer-events-auto group absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
                    style={{
                      left: `${(screen.x / WORLD_ATLAS_WIDTH) * 100}%`,
                      top: `${(screen.y / WORLD_ATLAS_HEIGHT) * 100}%`,
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(active ? null : primary.slug);
                    }}
                    aria-pressed={active}
                    aria-expanded={active}
                    aria-label={
                      pin.stories.length === 1
                        ? `${primary.title}, ${primary.region}, ${primary.country}`
                        : `${label}: ${pin.stories.map((story) => story.title).join(", ")}`
                    }
                  >
                    <span className="pointer-events-none relative flex h-4 w-4 items-center justify-center">
                      <span
                        className={cn(
                          "absolute inset-0 rounded-full bg-gold/30 motion-safe:transition motion-safe:duration-200",
                          active && "scale-150 bg-gold/45",
                          "group-hover:scale-125 group-hover:bg-gold/40 group-focus-visible:scale-125",
                        )}
                      />
                      <span
                        className={cn(
                          "relative block h-2.5 w-2.5 rounded-full border border-[#06101f] bg-gold shadow-[0_0_0_3px_rgba(184,154,92,0.28)] motion-safe:transition motion-safe:duration-200",
                          active &&
                            "h-3 w-3 bg-ivory shadow-[0_0_0_6px_rgba(184,154,92,0.4)]",
                        )}
                      />
                      {pin.stories.length > 1 ? (
                        <span className="pointer-events-none absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full border border-[#06101f] bg-ivory px-1 text-[9px] font-medium text-navy">
                          {pin.stories.length}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "pointer-events-none absolute top-8 left-1/2 z-30 hidden w-max max-w-[14rem] -translate-x-1/2 rounded-full border border-gold/35 bg-[#071325]/95 px-2.5 py-1 text-center text-[9px] tracking-[0.16em] text-gold uppercase opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block",
                        active && "opacity-100 text-ivory",
                      )}
                    >
                      {pin.stories.length === 1 ? primary.region : `${pin.stories.length} field notes`}
                      <span className="mt-0.5 block tracking-[0.12em] text-ivory/55 normal-case">
                        {primary.country}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-none absolute top-[62%] left-[8%] hidden h-10 w-10 opacity-55 sm:block sm:h-12 sm:w-12">
              <CompassRose className="h-full w-full" />
            </div>

            {selected && selectedPin ? (
              <MapStoryPreview
                story={selected}
                companions={companionsFor(selected, selectedPin)}
                onClose={() => onSelect(null)}
                onSelect={onSelect}
                onRevealInGallery={onRevealInGallery}
                className={cn(
                  "absolute top-3 hidden max-h-[calc(100%-1.5rem)] w-[min(19rem,calc(100%-5.5rem))] overflow-y-auto sm:block",
                  toScreen(selectedPin.x, selectedPin.y, view).x > WORLD_ATLAS_WIDTH * 0.58
                    ? "left-3"
                    : "right-3",
                )}
              />
            ) : null}
          </div>
        </div>
        {selected && selectedPin ? (
          <MapStoryPreview
            story={selected}
            companions={companionsFor(selected, selectedPin)}
            onClose={() => onSelect(null)}
            onSelect={onSelect}
            onRevealInGallery={onRevealInGallery}
            className="relative mt-3 w-full sm:hidden"
          />
        ) : null}
      </div>
      <p className="px-6 pb-5 text-[10px] tracking-[0.16em] text-ivory/40 uppercase sm:px-8">
        Map data: Natural Earth 50m, public domain · naturalearthdata.com
      </p>
    </section>
  );
}

function companionsFor(story: LogbookStory, pin: MapPin) {
  const fromPin = pin.stories.filter((other) => other.slug !== story.slug);
  if (fromPin.length > 0) return fromPin;
  const here = projectAtlasPoint(story.lat, story.lng);
  return logbookStories.filter((other) => {
    if (other.slug === story.slug) return false;
    const point = projectAtlasPoint(other.lat, other.lng);
    return Math.hypot(point.x - here.x, point.y - here.y) < 72;
  });
}

function MapControl({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-[#071325]/92 text-lg leading-none text-gold shadow-lg transition hover:border-gold hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {children}
    </button>
  );
}

function MapStoryPreview({
  story,
  companions,
  onClose,
  onSelect,
  onRevealInGallery,
  className,
}: {
  story: LogbookStory;
  companions: LogbookStory[];
  onClose: () => void;
  onSelect: (slug: string | null) => void;
  onRevealInGallery: (slug: string) => void;
  className?: string;
}) {
  const mission = getLibraryMission(story.missionSlug);

  return (
    <article
      className={cn(
        "pointer-events-auto z-40 rounded-[1.15rem] border border-gold/35 bg-paper p-4 shadow-[0_18px_50px_rgba(7,16,32,0.45)]",
        className,
      )}
    >
      <p className="text-[10px] tracking-[0.22em] text-gold-ink uppercase">
        Demo field note · {story.date}
      </p>
      <h3 className="mt-2 font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
        {story.title}
      </h3>
      <p className="mt-2 text-sm text-ink-soft">
        {mission?.title ?? story.missionSlug}
      </p>
      <p className="mt-1 text-[11px] tracking-[0.16em] text-ink-soft uppercase">
        {story.region} · {story.country}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink">{story.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href={`/logbook/${story.slug}`}
          className="text-[11px] font-medium tracking-[0.22em] text-navy uppercase transition hover:text-gold-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
        >
          Read field notes
        </Link>
        <button
          type="button"
          className="text-[11px] font-medium tracking-[0.18em] text-ink-soft uppercase transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
          onClick={() => onRevealInGallery(story.slug)}
        >
          View in gallery
        </button>
        <button
          type="button"
          className="ml-auto text-[11px] tracking-[0.18em] text-ink-soft uppercase hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      {companions.length > 0 ? (
        <div className="mt-3 border-t border-ink/10 pt-3">
          <p className="text-[10px] tracking-[0.18em] text-ink-soft uppercase">
            Nearby notes
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {companions.map((other) => (
              <button
                key={other.id}
                type="button"
                className="rounded-full border border-ink/15 px-2.5 py-1 text-[10px] tracking-[0.12em] text-ink uppercase transition hover:border-gold hover:text-navy"
                onClick={() => onSelect(other.slug)}
              >
                {other.region}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
