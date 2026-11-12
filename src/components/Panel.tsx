// Panels: paper with a 3 px ink outline and a coloured ribbon header. Text never sits in long cards.
// Also the Mission Intel card (real NASA data, styled like a collectable card), badges, source lines
// and the level task list. BUILD_SEQUENCE.md §4.6–4.7.
import type { ReactNode } from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { BUILT_SCREENS, useGame } from '../store/game';

export type RibbonTone = 'ink' | 'go' | 'danger' | 'space' | 'good';
const RIBBON: Record<RibbonTone, string> = {
  ink: 'bg-ink text-paper',
  go: 'bg-go text-white',
  danger: 'bg-danger text-white',
  space: 'bg-sky-space text-paper',
  good: 'bg-good text-white',
};

/** The ribbon tag that sits across a panel's top edge. 18 px+ bold, so every tone passes. */
export function Ribbon({ children, tone = 'ink', icon: Icon }: { children: ReactNode; tone?: RibbonTone; icon?: LucideIcon }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border-[3px] border-ink px-3.5 py-0.5 font-display text-lg leading-snug font-extrabold tracking-wide uppercase shadow-[0_3px_0_var(--color-ink)] ${RIBBON[tone]}`}
    >
      {Icon ? <Icon size={18} strokeWidth={2.75} aria-hidden /> : null}
      <span className="truncate pt-0.5">{children}</span>
    </span>
  );
}

/** Paper panel, ink outline, 24 px corners, one soft shadow, optional ribbon header. Replaces MissionCard. */
export function Panel({
  children,
  ribbon,
  tone = 'ink',
  icon,
  className = '',
  as: Tag = 'section',
}: {
  children: ReactNode;
  ribbon?: ReactNode;
  tone?: RibbonTone;
  icon?: LucideIcon;
  className?: string;
  as?: 'section' | 'div' | 'article';
}) {
  return (
      <Tag className={`on-paper rise relative rounded-panel border-[3px] border-ink bg-paper p-4 text-ink shadow-panel sm:p-6 ${ribbon ? 'mt-4 pt-7 sm:pt-8' : ''} ${className}`}>
        {ribbon ? (
          <div className="absolute -top-[18px] left-4 right-4 flex">
            <Ribbon tone={tone} icon={icon}>
              {ribbon}
            </Ribbon>
          </div>
        ) : null}
        {children}
      </Tag>
  );
}

// ---------- badges and sources ----------

export type BadgeKind = 'NASA LIVE' | 'NASA ARCHIVE' | 'GAME ESTIMATE' | 'FICTION';
const BADGE_LOOK: Record<BadgeKind, string> = {
  // LIVE: a green dot on paper (white text on green is under 4.5:1 at this size).
  'NASA LIVE': 'bg-paper text-ink border-good',
  'NASA ARCHIVE': 'bg-ink text-paper border-ink',
  'GAME ESTIMATE': 'bg-paper text-ink border-ink border-dashed',
  FICTION: 'bg-[#ffe3ec] text-ink border-ink',
};

export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border-[3px] px-2 py-0.5 font-display text-sm leading-snug font-extrabold tracking-wider ${BADGE_LOOK[kind]}`}>
      {kind === 'NASA LIVE' ? <span className="h-2.5 w-2.5 rounded-full bg-good" aria-hidden /> : null}
      {kind}
    </span>
  );
}

/** One small line under any fact. Opens the Sources page once it exists. */
export function SourceLine({ text, bare }: { text: string; /** No divider: for a line on its own paper strip. */ bare?: boolean }) {
  const go = useGame((s) => s.go);
  const line = `Source: ${text}`;
  const look = bare ? 'block text-sm text-muted' : 'mt-4 block w-full border-t-2 border-edge pt-2 text-sm text-muted';
  return BUILT_SCREENS.has('sources') ? (
    <button onClick={() => go('sources')} className={`${look} text-left font-sans underline-offset-4 hover:underline`}>
      {line}
    </button>
  ) : (
    <p className={look}>{line}</p>
  );
}

/** A source line on its own small paper strip, for facts shown straight on a scene. */
export function SourceStrip({ text }: { text: string }) {
  return (
    <div className="on-paper rounded-2xl border-2 border-ink bg-paper px-3 py-1.5">
      <SourceLine text={text} bare />
    </div>
  );
}

/**
 * Mission Intel: real NASA data as a collectable card — a photo or a big figure in a chunky frame,
 * one kid sentence, the badge and the date. A photo is never a wallpaper behind text. Replaces DataCard.
 */
export function IntelCard({
  badge,
  date,
  sentence,
  figure,
  image,
  source,
  title = 'Mission Intel',
}: {
  badge: BadgeKind;
  date?: string;
  sentence: string;
  figure?: ReactNode;
  image?: { src: string; alt: string; credit: string };
  source?: string;
  title?: string;
}) {
  return (
    <Panel as="article" ribbon={title} tone="space" className="!p-3 !pt-7 sm:!p-4 sm:!pt-8">
      <div className="rounded-[18px] border-[3px] border-ink bg-white p-2">
        {image ? (
          <figure>
            <img src={image.src} alt={image.alt} className="aspect-video w-full rounded-[12px] border-[3px] border-ink object-cover" loading="lazy" />
            <figcaption className="mt-1 px-1 text-sm text-muted">{image.credit}</figcaption>
          </figure>
        ) : null}
        {figure !== undefined ? (
          <div className="grid min-h-24 place-items-center rounded-[12px] border-[3px] border-ink bg-sky-space px-3 py-2 font-display text-[52px] leading-none font-extrabold text-paper tabular-nums">
            {figure}
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
        <Badge kind={badge} />
        {date ? <span className="text-sm font-bold text-muted">{date}</span> : null}
      </div>
      <p className="mt-2 px-1 text-lg leading-snug">{sentence}</p>
      {source ? (
        <div className="px-1">
          <SourceLine text={source} />
        </div>
      ) : null}
    </Panel>
  );
}

// ---------- task list ----------

export type Task = { label: string; done?: boolean };

/**
 * The level's steps as a short checklist. The first task not done is "now".
 * `strip` is the slim progress strip under the HUD (A6); `list` is the full checklist (level opening).
 */
export function TaskList({ tasks, variant = 'list' }: { tasks: Task[]; variant?: 'list' | 'strip' }) {
  const now = tasks.findIndex((t) => !t.done);
  if (variant === 'strip') {
    const current = tasks[now] ?? tasks[tasks.length - 1];
    return (
      <div className="flex items-center gap-3 rounded-full border-[3px] border-ink bg-paper px-3 py-1.5 text-ink" aria-label={`Step ${Math.max(0, now) + 1} of ${tasks.length}: ${current.label}`}>
        <ol className="flex shrink-0 items-center gap-1" aria-hidden>
          {tasks.map((t, i) => (
            <li
              key={i}
              className={`h-3 rounded-full border-2 border-ink ${t.done ? 'w-5 bg-good' : i === now ? 'w-8 bg-go' : 'w-5 bg-white'}`}
            />
          ))}
        </ol>
        <span className="min-w-0 truncate font-display text-lg leading-tight font-extrabold">{now === -1 ? 'All done!' : current.label}</span>
      </div>
    );
  }
  return (
    <ol className="space-y-2" aria-label="This level's tasks">
      {tasks.map((t, i) => {
        const here = i === now;
        return (
          <li key={i} className="flex items-center gap-2.5">
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[3px] border-ink font-display text-[19px] leading-none font-extrabold ${
                t.done ? 'bg-good text-white' : here ? 'bg-go text-white' : 'bg-white text-ink'
              }`}
              aria-hidden
            >
              {t.done ? <Check size={18} strokeWidth={3.5} /> : i + 1}
            </span>
            <span className={`font-display text-lg leading-tight ${here ? 'font-extrabold' : t.done ? 'font-bold text-muted line-through decoration-2' : 'font-bold'}`}>
              {t.label}
              <span className="sr-only">{t.done ? ' (done)' : here ? ' (now)' : ''}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
