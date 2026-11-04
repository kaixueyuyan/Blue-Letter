export function JoinHero() {
  return (
    <section className="relative overflow-hidden bg-navy px-5 py-20 text-ivory sm:px-8 sm:py-28">
      <span aria-hidden className="gold-rule absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium tracking-[0.34em] text-gold uppercase">
          Crew roster
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.92] font-medium tracking-tight text-pretty">
          Your story belongs in this expedition.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/75">
          Blue Letter connects communities through shared creative missions and
          supervised cultural exchange. Adult volunteers and partner
          organizations can send an application for review. A sent form is not
          an acceptance, and children are not registered on this page.
        </p>
      </div>
    </section>
  );
}
