// Panels: dark `panel` with a 2 px `line` border and a coloured ribbon header. Text never sits in long cards.
// Also the Mission Intel card (real NASA data, styled like a collectable card), badges, source lines
// and the level task list. BUILD_SEQUENCE.md §4.3, §4.6.
import type { ReactNode } from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { BUILT_SCREENS, useGame } from '../store/game';

export type RibbonTone = 'ink' | 'go' | 'danger' | 'space' | 'good';
const RIBBON: Record<RibbonTone, string> = {
  ink: 'bg-panel-up text-text',
  go: 'bg-go text-go-text',
  danger: 'bg-danger text-white',
  space: 'bg-sky-space text-text',
  good: 'bg-good text-white',
};

/** The ribbon tag that sits across a panel's top edge. Bold, so every tone passes. */
export function Ribbon({ children, tone = 'ink', icon: Icon, small }: { children: ReactNode; tone?: RibbonTone; icon?: LucideIcon; small?: boolean }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border-2 border-line px-3.5 py-0.5 font-display leading-snug font-extrabold tracking-wide uppercase ${small ? 'text-[0.9375rem]' : 'text-[1.125rem]'} ${RIBBON[tone]}`}
    >
      {Icon ? <Icon size={18} strokeWidth={2.75} aria-hidden /> : null}
      <span className="truncate pt-0.5">{children}</span>
    </span>
  );
}

/** Dark panel, 2 px line border, 1.5 rem corners, optional ribbon header. Replaces MissionCard. */
export function Panel({
  children,
  ribbon,
  tone = 'ink',
  icon,
  className = '',
  as: Tag = 'section',
  compact,
}: {
  children: ReactNode;
  ribbon?: ReactNode;
  tone?: RibbonTone;
  icon?: LucideIcon;
  className?: string;
  as?: 'section' | 'div' | 'article';
  /** Landscape stage: tighter padding and a smaller ribbon. */
  compact?: boolean;
}) {
  const pad = compact ? 'p-[0.75rem]' : 'p-4 sm:p-6';
  const top = ribbon ? (compact ? 'mt-[0.75rem] pt-[1.5rem]' : 'mt-4 pt-7 sm:pt-8') : '';
  return (
    <Tag className={`rise relative rounded-panel border-2 border-line bg-panel text-text ${pad} ${top} ${className}`}>
      {ribbon ? (
        <div className={`absolute right-4 left-4 flex ${compact ? '-top-[0.875rem]' : '-top-[1.125rem]'}`}>
          <Ribbon tone={tone} icon={icon} small={compact}>
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
  // LIVE: a green dot and a green border, so it is never colour alone.
  'NASA LIVE': 'bg-panel text-text border-good',
  'NASA ARCHIVE': 'bg-panel-up text-text border-line',
  'GAME ESTIMATE': 'bg-panel text-text border-line border-dashed',
  FICTION: 'bg-nova/25 text-text border-nova',
};

export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border-2 px-2 py-0.5 font-display text-sm leading-snug font-extrabold tracking-wider ${BADGE_LOOK[kind]}`}>
      {kind === 'NASA LIVE' ? <span className="h-2.5 w-2.5 rounded-full bg-good" aria-hidden /> : null}
      {kind}
    </span>
  );
}

/** One small line under any fact. Opens the Sources page once it exists. */
export function SourceLine({ text, bare }: { text: string; /** No divider: for a line on its own strip. */ bare?: boolean }) {
  const go = useGame((s) => s.go);
  const line = `Source: ${text}`;
  const look = bare ? 'block truncate text-[0.8125rem] leading-snug text-muted' : 'mt-4 block w-full border-t-2 border-line pt-2 text-sm text-muted';
  return BUILT_SCREENS.has('sources') ? (
    <button onClick={() => go('sources')} className={`${look} text-left font-sans underline-offset-4 hover:underline`}>
      {line}
    </button>
  ) : (
    <p className={look}>{line}</p>
  );
}

/** A source line on its own small dark strip, for facts shown straight on a scene. */
export function SourceStrip({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`truncate rounded-full border-2 border-line bg-panel/85 px-[0.75rem] py-[0.125rem] text-text ${className}`}>
      <SourceLine text={text} bare />
    </div>
  );
}

/**
 * Mission Intel: real NASA data as a collectable card — a photo or a big figure in a dark frame,
 * one kid sentence, the badge and the date. The photo stays the hero, and is never a wallpaper behind text.
 */
export function IntelCard({
  badge,
  date,
  sentence,
  figure,
  image,
  source,
  title = 'Mission Intel',
  compact,
}: {
  badge: BadgeKind;
  date?: string;
  sentence: string;
  figure?: ReactNode;
  image?: { src: string; alt: string; credit: string };
  source?: string;
  title?: string;
  /** Landscape stage: the picture or figure on the left, badge and sentence on the right. */
  compact?: boolean;
}) {
  if (compact)
    return (
      <Panel as="article" ribbon={title} tone="space" compact className="!pb-[0.5rem]">
        <div className="flex items-center gap-[0.75rem]">
          <div className="w-[7rem] shrink-0 overflow-hidden rounded-[0.75rem] border-2 border-line bg-space-deep">
            {image ? (
              <img src={image.src} alt={image.alt} className="aspect-video w-full object-cover" loading="lazy" />
            ) : (
              <div className="grid min-h-[3.5rem] place-items-center bg-sky-space px-[0.25rem] py-[0.25rem] font-display text-[1.75rem] leading-none font-extrabold text-text tabular-nums">{figure}</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.125rem]">
              <Badge kind={badge} />
              {date ? <span className="text-[0.8125rem] font-bold text-muted">{date}</span> : null}
            </div>
            <p className="mt-[0.25rem] text-[0.9375rem] leading-snug">{sentence}</p>
          </div>
        </div>
        {source ? <SourceLine text={source} bare /> : null}
      </Panel>
    );
  return (
    <Panel as="article" ribbon={title} tone="space" className="!p-3 !pt-7 sm:!p-4 sm:!pt-8">
      <div className="rounded-[1.125rem] border-2 border-line bg-space-deep p-2">
        {image ? (
          <figure>
            <img src={image.src} alt={image.alt} className="aspect-video w-full rounded-[0.75rem] object-cover" loading="lazy" />
            <figcaption className="mt-1 px-1 text-sm text-muted">{image.credit}</figcaption>
          </figure>
        ) : null}
        {figure !== undefined ? (
          <div className="grid min-h-24 place-items-center rounded-[0.75rem] bg-sky-space px-3 py-2 font-display text-[3.25rem] leading-none font-extrabold text-text tabular-nums">
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
      <div className="flex items-center gap-[0.5rem] rounded-full border-2 border-line bg-panel/85 px-[0.625rem] py-[0.25rem] text-text" aria-label={`Step ${Math.max(0, now) + 1} of ${tasks.length}: ${current.label}`}>
        <ol className="flex shrink-0 items-center gap-1" aria-hidden>
          {tasks.map((t, i) => (
            <li
              key={i}
              className={`h-3 rounded-full border-2 border-line ${t.done ? 'w-5 bg-good' : i === now ? 'w-8 bg-go' : 'w-5 bg-space-deep'}`}
            />
          ))}
        </ol>
        <span className="min-w-0 truncate font-display text-[0.9375rem] leading-tight font-extrabold">{now === -1 ? 'All done!' : current.label}</span>
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
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-line font-display text-[1.1875rem] leading-none font-extrabold ${
                t.done ? 'bg-good text-white' : here ? 'bg-go text-go-text' : 'bg-space-deep text-text'
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
