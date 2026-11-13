// Emergency drill overlay for Fly: alert -> pick an action -> learn why.
import { useState } from 'react';
import { Sun, Gauge, Flame, Siren, CheckCircle2, XCircle } from 'lucide-react';
import { t } from '../content/i18n';
import { emergencyKeys, type Emergency, type EmergencyId } from './emergencies';

const ICONS: Record<EmergencyId, typeof Sun> = { solar: Sun, leak: Gauge, fire: Flame };

interface Props {
  emergency: Emergency;
  onDone: (correct: boolean) => void;
}

export function EmergencyCard({ emergency, onDone }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const keys = emergencyKeys(emergency.id);
  const Icon = ICONS[emergency.id];
  const answered = picked !== null;
  const correct = picked === emergency.correct;

  return (
    <div
      role="alertdialog"
      aria-label={t(keys.title)}
      className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-space-deep/90 p-3 sm:p-6 text-text"
    >
      <div className="w-full max-w-md rounded-3xl border-2 border-danger bg-panel p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-danger px-3 py-1 text-[0.6875rem] font-extrabold uppercase tracking-wider text-white">
            <Siren size={14} /> {t('fly.em.badge')}
          </span>
          <Icon size={28} className="text-star" />
        </div>

        <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">{t(keys.title)}</h2>
        <p className="mt-1 text-sm text-text/85 leading-snug">{t(keys.alert)}</p>

        {!answered ? (
          <>
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">{t('fly.em.ask')}</p>
            <div className="mt-2 flex flex-col gap-2">
              {keys.options.map((key, i) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPicked(i)}
                  className="min-h-[2.75rem] cursor-pointer rounded-xl border-2 border-line bg-panel-up px-3 py-2 text-left text-sm font-bold leading-snug transition hover:border-go active:translate-y-0.5"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-3">
            <div
              className={`flex items-center gap-2 font-display text-base font-extrabold ${
                correct ? 'text-go' : 'text-danger'
              }`}
            >
              {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              <span>{correct ? t('fly.em.right') : t('fly.em.wrong')}</span>
            </div>
            {!correct && (
              <p className="mt-1 rounded-xl bg-space-deep/60 p-2 text-sm font-bold text-go leading-snug">
                {t(keys.options[emergency.correct])}
              </p>
            )}
            <p className="mt-2 text-sm text-text/85 leading-snug">{t(keys.why)}</p>
            <p className="mt-2 rounded-xl border border-line/50 bg-space-deep/50 p-2 text-xs text-muted leading-snug">
              <span className="font-extrabold text-star">{t('fly.em.fact')}: </span>
              {t(keys.fact)}
            </p>
            <p className="mt-2 text-xs font-extrabold text-star">
              {correct ? t('fly.em.reward') : t('fly.em.noReward')}
            </p>
            <button
              type="button"
              onClick={() => onDone(correct)}
              className="mt-3 inline-flex min-h-[2.75rem] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-go bg-go px-4 py-2 font-display text-base font-extrabold text-go-text shadow-[0_0.3rem_0_#0F8F9C] active:translate-y-1 active:shadow-none"
            >
              {t('fly.em.continue')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
