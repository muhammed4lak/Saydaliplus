import { NavIcon } from '@/components/icons';

/**
 * An honest placeholder.
 *
 * The build order in the brief is 1–4 before 5, and these screens belong to the
 * later phases. A screen that looks finished but does nothing is worse than one
 * that says what it is: it costs a reviewer the time to discover the gap, and it
 * is the kind of thing that gets demoed to a pharmacy by accident.
 *
 * Every use of this is listed in README.md under "What is not built yet".
 */
export function NotBuiltYet({
  title,
  phase,
  detail,
}: {
  title: string;
  phase: string;
  detail: string;
}) {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 text-center md:py-20">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-tint">
        <NavIcon name="lock" className="h-5 w-5 text-indigo" />
      </div>

      <h2 className="font-display text-[17px] font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-ink-soft">{detail}</p>
      <p className="mt-4 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-faint">
        {phase}
      </p>
    </div>
  );
}
