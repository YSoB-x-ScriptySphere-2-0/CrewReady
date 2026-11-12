// The play screen, in the three landscape zones (BUILD_SEQUENCE.md §4.2, R3).
// Top strip: the HUD. Left: your kid and Twinkle, reacting. Right: Twinkle's bubble on top, the thing you touch
// under it (three choice cards with Look first, or a hands-on step), the source line at the bottom.
// After GO the cards slide away and the result (what happened, the chips, Next) takes their place.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CircleHelp, Rocket, X } from 'lucide-react';
import { Decision, optionCosts } from '../components/Decision';
import { ChangeChip, GameButton, RoundButton } from '../components/GameButton';
import { LEVEL_SCENE, LevelHud, LevelZones, outcomeChanges, tasksFor, totalChange } from '../components/LevelChrome';
import { MeterBadge } from '../components/meters';
import { flyToHud } from '../components/motion';
import { Panel, SourceStrip, TaskList } from '../components/Panel';
import { ResultMoment } from '../components/Result';
import { hasToy, ToyHost } from '../components/toys';
import { captionFor } from '../content/pictures';
import { Scene } from '../components/Scene';
import { StepView, USES_LEFT_ZONE } from '../components/steps';
import { Bubble, Kid, kidPose, reactionFor, Twinkle, TWINKLE_FOR } from '../components/Twinkle';
import { iconFor, iconForEntry } from '../content/icons';
import { LEVELS } from '../content/levels';
import { METERS, METER_NAMES, type ChoiceStep, type GameState, type Level, type Meter, type Outcome } from '../engine/types';
import { useGame } from '../store/game';

/** Twinkle's hint: names the lowest meter and, for a decision, what each option costs. Never which to pick. */
function Hint({ step, game, level, onClose }: { step: Level['steps'][number]; game: GameState; level: Level; onClose: () => void }) {
  const lowest = METERS.reduce((a, b) => (game.meters[b] < game.meters[a] ? b : a));
  const costs = step.kind === 'choice' ? optionCosts(step as ChoiceStep, game, level) : [];
  return (
    <Panel ribbon="Twinkle's hint" tone="space" compact className="!absolute inset-x-0 top-0 bottom-0 z-20 !mt-0 !bg-panel">
      <button onClick={onClose} aria-label="Hide hint" className="absolute top-[0.125rem] right-[0.25rem] z-10 grid h-[2.75rem] w-[2.75rem] place-items-center rounded-full text-text">
        <X size={22} strokeWidth={3} />
      </button>
      <div className="h-full overflow-y-auto">
      <div className="flex items-start gap-[0.75rem]">
        <Twinkle mood="question" size={48} />
        <div className="min-w-0">
          <p className="text-[0.9375rem] leading-snug">{step.hint}</p>
          <p className="mt-[0.25rem] flex flex-wrap items-center gap-[0.375rem] font-display text-[1rem] font-extrabold">
            Lowest: <MeterBadge meter={lowest} size={24} /> {METER_NAMES[lowest]} ({game.meters[lowest]}).
          </p>
        </div>
      </div>
      {costs.length ? (
        <ul className="mt-[0.5rem] space-y-[0.375rem] border-t-2 border-line pt-[0.5rem]" aria-label="What each choice costs">
          {costs.map(({ option, changes }) => {
            const Icon = iconFor(option.label);
            return (
              <li key={option.label} className="flex items-center gap-[0.5rem]">
                <span className="grid h-[2rem] w-[2rem] shrink-0 place-items-center rounded-[0.5rem] border-2 border-line bg-space" aria-hidden>
                  <Icon size={18} strokeWidth={2.25} />
                </span>
                <span className="min-w-0 flex-1 truncate font-display text-[0.9375rem] leading-tight font-bold">{option.label}</span>
                <span className="flex shrink-0 flex-wrap justify-end gap-[0.25rem]">
                  {changes.map((c) => (
                    <ChangeChip key={c.meter} change={c} size="sm" />
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
      </div>
    </Panel>
  );
}

export function Play() {
  const { game, levelIndex, stepIndex, outcome, act, next, retryStep, log } = useGame();
  const [hint, setHint] = useState(false);
  const [hudPreview, setHudPreview] = useState<Record<Meter, number> | null>(null);
  const [look, setLook] = useState<Partial<Record<Meter, number>> | null>(null);
  const level = LEVELS[levelIndex];
  const step = level.steps[stepIndex];
  const last = stepIndex + 1 >= level.steps.length;
  const resultRef = useRef<HTMLDivElement>(null);
  // The Try-it toy (levels 2–5) comes after the opening and before the first decision. Skippable; changes nothing.
  const [toyDone, setToyDone] = useState(false);
  const toy = !toyDone && stepIndex === 0 && !outcome && hasToy(level.id);

  // Stars earned fly from the result to the HUD counter; the counter adds them when they land.
  const [landed, setLanded] = useState<Outcome | null>(null);
  const flown = useRef<Outcome | null>(null);
  const held = outcome && outcome.starsDelta > 0 && landed !== outcome ? outcome.starsDelta : 0;
  useEffect(() => {
    if (!outcome || outcome.starsDelta <= 0 || flown.current === outcome) return;
    flown.current = outcome;
    const from = resultRef.current;
    (from ? flyToHud(from) : Promise.resolve()).then(() => setLanded(outcome));
  }, [outcome]);

  // Focus Next when the result lands.
  useEffect(() => {
    if (!outcome) return;
    resultRef.current?.querySelector<HTMLButtonElement>('button.toy')?.focus({ preventScroll: true });
  }, [outcome]);

  const reaction = outcome ? reactionFor(totalChange(outcome)) : 'choosing';
  const changes = outcome ? outcomeChanges(outcome) : [];
  const chosenLabel = outcome ? (log[log.length - 1]?.label ?? step.task) : '';
  const ChosenIcon = iconForEntry(chosenLabel);

  // Steps that need room draw into the left zone; the kid shrinks to a corner meanwhile.
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const roomy = !outcome && USES_LEFT_ZONE.has(step.kind);
  const left = (
    <>
      <div className="w-full">
        <TaskList variant="strip" tasks={tasksFor(levelIndex, stepIndex)} />
      </div>
      {roomy ? <div ref={setSlot} className="min-h-0 w-full flex-1" /> : null}
      <div className={`flex items-end justify-center gap-[0.25rem] ${roomy ? 'shrink-0' : 'min-h-0 flex-1'}`}>
        <span className="mb-[0.5rem]">
          <Twinkle mood={TWINKLE_FOR[reaction]} size={roomy ? 44 : 60} />
        </span>
        <Kid who="orbit" pose={kidPose('orbit', reaction)} height={roomy ? '4.5rem' : 'min(13rem, 100%)'} label="Orbit reacts" className="max-h-full" />
      </div>
    </>
  );

  return (
    <Scene bare place={LEVEL_SCENE[level.id]} top={<LevelHud meters={hudPreview ?? game.meters} stars={game.stars - held} look={look ?? undefined} />}>
      <LevelZones left={left}>
        {toy ? (
          <ToyHost levelId={level.id} learned={level.learned} onDone={() => setToyDone(true)} />
        ) : (
          <>
        <div className="flex items-end gap-[0.5rem]">
          <Bubble className="mb-[0.25rem] min-w-0 flex-1 text-[1.0625rem]" speak={step.kind === 'choice' ? `${step.prompt} ${(step as ChoiceStep).options.map((o) => o.label).join('. ')}.` : step.prompt}>{step.kind === 'choice' ? captionFor(step.prompt) : step.prompt}</Bubble>
          {!outcome ? <RoundButton icon={CircleHelp} label={hint ? 'Hide hint' : 'Ask Twinkle'} pressed={hint} onClick={() => setHint(!hint)} /> : null}
        </div>

        <div className="relative min-h-0 flex-1">
          {outcome ? (
            <div ref={resultRef} className="rise flex h-full min-h-0 flex-col gap-[0.5rem]">
              <ResultMoment
                label={chosenLabel}
                outcome={outcome}
                changes={changes}
                fallback={ChosenIcon}
                ribbon={reaction === 'good' ? 'Nice!' : 'What happened'}
                tone={reaction === 'good' ? 'good' : 'danger'}
              />
              <div className="flex justify-end">
                <GameButton
                  variant="go"
                  icon={last && !retryStep ? Rocket : ArrowRight}
                  className="!min-h-[3rem]"
                  onClick={() => {
                    setHint(false);
                    next();
                  }}
                >
                  {retryStep ? 'Try the landing again' : last ? (levelIndex + 1 >= LEVELS.length ? 'Finish the mission' : 'Next level') : 'Next'}
                </GameButton>
              </div>
            </div>
          ) : step.kind === 'choice' ? (
            <Decision
              key={`${levelIndex}-${stepIndex}`}
              step={step}
              game={game}
              level={level}
              onDone={(o, label) => {
                setHint(false);
                act(o, { label });
              }}
              onHudPreview={setHudPreview}
              onLook={setLook}
            />
          ) : (
            <StepView key={`${levelIndex}-${stepIndex}`} step={step} game={game} level={level} slot={slot} onDone={(o, opts) => act(o, { ...opts, label: step.task })} />
          )}
          {hint && !outcome ? <Hint step={step} game={game} level={level} onClose={() => setHint(false)} /> : null}
        </div>

        <SourceStrip text={level.source} />
          </>
        )}
      </LevelZones>
    </Scene>
  );
}
