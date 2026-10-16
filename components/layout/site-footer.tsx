export function SiteFooter() {
  return (
    <footer className="mt-8">
      <div className="gold-rule h-px w-full" />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-12 text-sm text-ink-soft sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl text-ink">Blue Letter · World Expedition</p>
          <p className="mt-2 max-w-md leading-7">
            A cultural exchange carried by missions, not slogans. Rural Chinese
            children and overseas volunteers keep the same logbook.
          </p>
        </div>
        <p className="text-[10px] tracking-[0.28em] uppercase">
          26°N · 108°E — and every other coordinate
        </p>
      </div>
    </footer>
  );
}
