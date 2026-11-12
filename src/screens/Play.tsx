// A6 — the play screen, the screen kids see most. HUD on top, a task-progress strip, the question in a
// speech bubble, options as big ChoiceTiles, and a round Ask Twinkle button. After a choice: the tile stamps,
// the others slide away, the HUD reacts, stars fly to the counter, the kid reacts, then a result panel with
// Next. Hands-on steps (crates, stowing, checklist, battery, crew) render through StepView. BUILD_SEQUENCE.md §6 A6.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CircleHelp, Rocket } from 'lucide-react';
import { Decision, optionCosts } from '../components/Decision';
import { ChangeChip, GameButton, RoundButton } from '../components/GameButton';
import { LEVEL_SCENE, LevelHud, outcomeChanges, tasksFor, totalChange } from '../components/LevelChrome';
import { MeterBadge } from '../components/meters';
import { flyToHud, reducedMotion } from '../components/motion';
import { Panel, SourceStrip, TaskList } from '../components/Panel';
import { Scene } from '../components/Scene';
import { StepView } from '../components/steps';
import { Kid, kidPose, reactionFor, Twinkle, TWINKLE_FOR, TwinkleSays } from '../components/Twinkle';
import { iconFor } from '../content/icons';
import { LEVELS } from '../content/levels';
import { METERS, METER_NAMES, type ChoiceStep, type GameState, type Level, type Meter, type Outcome } from '../engine/types';
import { useGame } from '../store/game';

/** Twinkle's hint: names the lowest meter and, for a decision, what each option costs. Never which to pick. */
function Hint({ step, game, level }: { step: Level['steps'][number]; game: GameState; level: Level }) {
  const lowest = METERS.reduce((a, b) => (game.meters[b] < game.meters[a] ? b : a));
  const costs = step.kind === 'choice' ? optionCosts(step as ChoiceStep, game, level) : [];
  return (
    <Panel ribbon="Twinkle's hint" tone="space">
      <div className="flex items-start gap-3">
        <Twinkle mood="question" size={56} />
        <div className="min-w-0">
          <p className="text-lg leading-snug">{step.hint}</p>
          <p className="mt-2 flex flex-wrap items-center gap-1.5 font-display text-lg font-extrabold">
            Lowest: <MeterBadge meter={lowest} size={26} /> {METER_NAMES[lowest]} ({game.meters[lowest]}).
          </p>
        </div>
      </div>
      {costs.length ? (
        <ul className="mt-3 space-y-2 border-t-2 border-edge pt-3" aria-label="What each choice costs">
          {costs.map(({ option, changes }) => {
            const Icon = iconFor(option.label);
            return (
              <li key={option.label} className="flex items-start gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border-[3px] border-ink bg-edge" aria-hidden>
                  <Icon size={20} strokeWidth={2.25} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg leading-tight font-bold">{option.label}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {changes.map((c) => (
                      <ChangeChip key={c.meter} change={c} size="sm" />
                    ))}
                    {option.setFlag ? <span className="self-center text-base font-bold text-muted">Comes back later.</span> : null}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Panel>
  );
}

export function Play() {
  const { game, levelIndex, stepIndex, outcome, act, next, retryStep } = useGame();
  const [hint, setHint] = useState(false);
  const [hudPreview, setHudPreview] = useState<Record<Meter, number> | null>(null);
  const level = LEVELS[levelIndex];
  const step = level.steps[stepIndex];
  const last = stepIndex + 1 >= level.steps.length;
  const resultRef = useRef<HTMLDivElement>(null);

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

  // Bring the result and its Next button into view.
  useEffect(() => {
    if (!outcome) return;
    const el = resultRef.current;
    el?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    el?.querySelector<HTMLButtonElement>('button.toy')?.focus({ preventScroll: true });
  }, [outcome]);

  const reaction = outcome ? reactionFor(totalChange(outcome)) : 'choosing';
  const showStep = !outcome || step.kind === 'choice'; // a decision stays on screen, stamped
  const changes = outcome ? outcomeChanges(outcome) : [];

  return (
    <Scene place={LEVEL_SCENE[level.id]} top={<LevelHud meters={hudPreview ?? game.meters} stars={game.stars - held} />}>
      <TaskList variant="strip" tasks={tasksFor(levelIndex, stepIndex)} />

      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <TwinkleSays
            mood={TWINKLE_FOR[reaction]}
            size={68}
            speaker={step.kind === 'crew' ? <Kid who="orbit" pose="point" height={96} /> : undefined}
          >
            <span className="block text-[22px] leading-snug font-extrabold">{step.prompt}</span>
          </TwinkleSays>
        </div>
        {!outcome ? <RoundButton icon={CircleHelp} label={hint ? 'Hide hint' : 'Ask Twinkle'} pressed={hint} onClick={() => setHint(!hint)} className="mb-4" /> : null}
      </div>

      {hint && !outcome ? <Hint step={step} game={game} level={level} /> : null}

      {showStep ? (
        step.kind === 'choice' ? (
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
          />
        ) : (
          <StepView key={`${levelIndex}-${stepIndex}`} step={step} game={game} level={level} onDone={(o, opts) => act(o, { ...opts, label: step.task })} />
        )
      ) : null}

      {outcome ? (
        <div ref={resultRef} className="flex items-end gap-2">
          <Kid who="orbit" pose={kidPose('orbit', reaction)} height={110} label="Orbit reacts" className="sm:!h-[180px]" />
          <div className="min-w-0 flex-1">
            <Panel ribbon={reaction === 'good' ? 'Nice!' : 'What happened'} tone={reaction === 'good' ? 'good' : 'danger'}>
              <ul className="space-y-1 text-lg leading-snug">
                {outcome.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {changes.map((c) => (
                  <ChangeChip key={c.meter} change={c} />
                ))}
                {!changes.length ? <span className="text-muted">No meters moved — yet.</span> : null}
              </div>
              <div className="mt-5">
                <GameButton
                  variant="go"
                  icon={last && !retryStep ? Rocket : ArrowRight}
                  onClick={() => {
                    setHint(false);
                    next();
                  }}
                >
                  {retryStep ? 'Try the landing again' : last ? (levelIndex + 1 >= LEVELS.length ? 'Finish the mission' : 'Next level') : 'Next'}
                </GameButton>
              </div>
            </Panel>
          </div>
        </div>
      ) : null}

      <SourceStrip text={level.source} />
    </Scene>
  );
}
