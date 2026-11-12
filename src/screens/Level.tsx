// Level screens, restyled with the game kit in G2: the level opening and the play screen
// (decisions and hands-on steps). A5 and A6 build on these.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CircleHelp, Lightbulb, Play as PlayIcon, Rocket } from 'lucide-react';
import { ChangeChip, GameButton, RoundButton } from '../components/GameButton';
import { LEVEL_SCENE, LevelHud, outcomeChanges, totalChange } from '../components/LevelChrome';
import { MeterBadge } from '../components/meters';
import { flyToHud, reducedMotion } from '../components/motion';
import { Panel, SourceStrip, TaskList } from '../components/Panel';
import { Scene } from '../components/Scene';
import { StepView } from '../components/steps';
import { Kid, kidPose, reactionFor, Twinkle, TWINKLE_FOR, TwinkleSays } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
import { METERS, METER_NAMES, type Outcome } from '../engine/types';
import { useGame } from '../store/game';

const tasksFor = (levelIndex: number, done: number) => LEVELS[levelIndex].steps.map((s, i) => ({ label: s.task, done: i < done }));

export function LevelOpening() {
  const { game, checkpoint, levelIndex, entered, beginLevel } = useGame();
  const level = LEVELS[levelIndex];
  const carried = entered ? outcomeChanges(entered) : [];
  // Carry-overs play onto the HUD as the screen opens: show the meters from before, then let them move.
  const [settled, setSettled] = useState(!carried.length);
  useEffect(() => {
    if (settled) return;
    const t = setTimeout(() => setSettled(true), reducedMotion() ? 0 : 600);
    return () => clearTimeout(t);
  }, [settled]);
  const meters = settled ? game.meters : checkpoint.meters;

  return (
    <Scene place={LEVEL_SCENE[level.id]} top={<LevelHud meters={meters} stars={game.stars} />}>
      {entered && entered.reasons.length ? (
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <TwinkleSays mood="tablet" size={72}>
              <ul className="space-y-1">
                {entered.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              {carried.length ? (
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {carried.map((c) => (
                    <ChangeChip key={c.meter} change={c} size="sm" />
                  ))}
                </span>
              ) : null}
            </TwinkleSays>
          </div>
        </div>
      ) : null}

      <Panel ribbon={`Level ${level.id} · ${level.title}`} tone="go">
        <p className="font-display text-lg font-bold text-muted">{level.place}</p>
        <h1 className="sr-only">{level.title}</h1>
        <p className="mt-2 text-lg leading-snug">{level.story}</p>
        <p className="mt-3 flex items-start gap-2 rounded-tile border-[3px] border-ink bg-[#fff1c2] px-3 py-2 font-display text-lg leading-snug font-bold">
          <Lightbulb size={22} strokeWidth={2.75} aria-hidden className="mt-0.5 shrink-0" />
          <span>You'll learn: {level.teaches}</span>
        </p>
        <div className="mt-4">
          <TaskList tasks={tasksFor(levelIndex, 0)} />
        </div>
        <div className="mt-5">
          <GameButton variant="go" icon={PlayIcon} onClick={beginLevel} className="!px-10 !text-[26px]">
            GO!
          </GameButton>
        </div>
      </Panel>

      <SourceStrip text={level.source} />
    </Scene>
  );
}

export function Play() {
  const { game, levelIndex, stepIndex, outcome, act, next, retryStep } = useGame();
  const [hint, setHint] = useState(false);
  const level = LEVELS[levelIndex];
  const step = level.steps[stepIndex];
  const lowest = METERS.reduce((a, b) => (game.meters[b] < game.meters[a] ? b : a));
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

  return (
    <Scene place={LEVEL_SCENE[level.id]} top={<LevelHud meters={game.meters} stars={game.stars - held} />}>
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

      {hint && !outcome ? (
        <Panel ribbon="Twinkle's hint" tone="space">
          <div className="flex items-start gap-3">
            <Twinkle mood="question" size={56} />
            <div>
              <p className="text-lg leading-snug">{step.hint}</p>
              <p className="mt-2 flex flex-wrap items-center gap-1.5 font-display text-lg font-extrabold">
                Lowest: <MeterBadge meter={lowest} size={26} /> {METER_NAMES[lowest]} ({game.meters[lowest]}).
              </p>
            </div>
          </div>
        </Panel>
      ) : null}

      {showStep ? <StepView key={`${levelIndex}-${stepIndex}`} step={step} game={game} level={level} onDone={act} /> : null}

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
                {outcomeChanges(outcome).map((c) => (
                  <ChangeChip key={c.meter} change={c} />
                ))}
                {!outcomeChanges(outcome).length ? <span className="text-muted">No meters moved — yet.</span> : null}
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
