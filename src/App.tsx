import { useState } from 'react';
import { Award, Home as HomeIcon, Lock } from 'lucide-react';
import { StepView } from './components/steps';
import { Kid, Twinkle, TwinkleSays } from './components/Twinkle';
import { MeterIcon, Meters, MissionCard, OutcomePanel, PrimaryButton, QuietButton, Sky, SourceLine, Stars, type Place } from './components/ui';
import { LEVELS } from './content/levels';
import { outpostCheck } from './engine/engine';
import { METERS, METER_NAMES } from './engine/types';
import { Home } from './screens/Home';
import { Hook } from './screens/Hook';
import { MissionMap } from './screens/MissionMap';
import { Story } from './screens/Story';
import { useGame } from './store/game';

/** Sky colour for each level — BUILD_SEQUENCE.md §4.2. */
const LEVEL_PLACE: Record<number, Place> = { 1: 'earth', 2: 'space', 3: 'mars', 4: 'dust', 5: 'mars', 6: 'mars' };

function TopBar() {
  const { game, levelIndex, goHome } = useGame();
  const level = LEVELS[levelIndex];
  return (
    <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-edge pb-2">
      <button className="inline-flex min-h-11 items-center gap-1 rounded-btn pr-2 font-bold" onClick={goHome}>
        <HomeIcon size={20} strokeWidth={2} aria-hidden /> Home
      </button>
      <span className="text-center text-base font-bold">
        Level {level.id} of {LEVELS.length}
      </span>
      <Stars n={game.stars} />
    </div>
  );
}

function LevelOpening() {
  const { game, levelIndex, entered, beginLevel } = useGame();
  const level = LEVELS[levelIndex];
  return (
    <Sky place={LEVEL_PLACE[level.id]}>
      <Meters meters={game.meters} delta={entered?.delta} top={<TopBar />} />
      <MissionCard>
        <p className="font-bold tracking-wide text-muted">
          LEVEL {level.id} · {level.place}
        </p>
        <h1 className="font-display text-[26px] leading-tight font-extrabold sm:text-[32px]">{level.title}</h1>
        <p className="mt-3 text-lg">{level.story}</p>
        {entered && entered.reasons.length ? (
          <ul className="mt-3 list-disc space-y-1 pl-6">
            {entered.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5">
          <PrimaryButton onClick={beginLevel}>Begin</PrimaryButton>
        </div>
        <SourceLine text={level.source} />
      </MissionCard>
    </Sky>
  );
}

function Play() {
  const { game, levelIndex, stepIndex, outcome, act, next, retryStep } = useGame();
  const [hint, setHint] = useState(false);
  const level = LEVELS[levelIndex];
  const step = level.steps[stepIndex];
  const lowest = METERS.reduce((a, b) => (game.meters[b] < game.meters[a] ? b : a));
  const last = stepIndex + 1 >= level.steps.length;
  return (
    <Sky place={LEVEL_PLACE[level.id]}>
      <Meters meters={game.meters} delta={outcome?.delta} top={<TopBar />} />
      <MissionCard>
        <p className="font-bold text-muted">
          {level.title} · step {stepIndex + 1} of {level.steps.length}
        </p>
        <h2 className="mt-1 font-display text-2xl leading-snug font-bold">{step.prompt}</h2>
        {outcome ? null : (
          <div className="mt-4">
            <StepView key={`${levelIndex}-${stepIndex}`} step={step} game={game} level={level} onDone={act} />
            <div className="mt-5">
              <QuietButton onClick={() => setHint(!hint)}>{hint ? 'Hide hint' : 'Ask Twinkle'}</QuietButton>
              {hint ? (
                <div className="mt-3">
                  <TwinkleSays mood="question" size={64}>
                    {step.hint}{' '}
                    <span className="inline-flex items-center gap-1 font-bold">
                      Lowest: <MeterIcon meter={lowest} size={18} /> {METER_NAMES[lowest]} ({game.meters[lowest]}).
                    </span>
                  </TwinkleSays>
                </div>
              ) : null}
            </div>
          </div>
        )}
        <SourceLine text={level.source} />
      </MissionCard>
      {outcome ? (
        <OutcomePanel outcome={outcome}>
          <PrimaryButton
            onClick={() => {
              setHint(false);
              next();
            }}
          >
            {retryStep ? 'Try the landing again' : last ? (levelIndex + 1 >= LEVELS.length ? 'Finish the mission' : 'Next level') : 'Next'}
          </PrimaryButton>
        </OutcomePanel>
      ) : null}
    </Sky>
  );
}

function Replay() {
  const { game, levelIndex, lost, retryLevel, goHome } = useGame();
  const level = LEVELS[levelIndex];
  if (!lost) return null;
  return (
    <Sky place="alarm">
      <TwinkleSays mood="worried" size={84}>
        Mission paused. Nobody is hurt. Let's see what happened.
      </TwinkleSays>
      <Meters meters={game.meters} />
      <MissionCard>
        <p className="font-bold tracking-wide text-danger">MISSION REPLAY</p>
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold">
          <MeterIcon meter={lost.meter} size={26} /> {METER_NAMES[lost.meter]} ran out.
        </h1>
        <h2 className="mt-4 font-display text-xl font-bold">What caused it</h2>
        <ul className="mt-1 list-disc space-y-1 pl-6">
          {lost.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <h2 className="mt-4 font-display text-xl font-bold">What real crews do</h2>
        <p className="mt-1">{level.replay[lost.meter] ?? level.replay.default}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <PrimaryButton onClick={retryLevel}>Try this level again</PrimaryButton>
          <QuietButton onClick={goHome}>Home</QuietButton>
        </div>
        <SourceLine text={level.source} />
      </MissionCard>
    </Sky>
  );
}

const RESULT_TEXT = {
  survives: { title: 'Outpost Survives', rank: 'Cadet', line: 'You made it! The base is weak. The next crew has work to do.' },
  stable: { title: 'Outpost Stable', rank: 'Pilot', line: 'The base can hold on until the next rocket comes.' },
  thriving: { title: 'Outpost Thriving', rank: 'Commander', line: 'Earth is cheering. People now have a second home.' },
};

function Success() {
  const { game, startMission, goHome } = useGame();
  const { healthy, result } = outpostCheck(game);
  const text = RESULT_TEXT[result];
  return (
    <Sky place="success">
      <div className="relative z-10 -mb-8 flex items-end justify-center gap-2 sm:gap-8">
        <Kid who="nova" pose="cheer" height={170} className="sm:!h-[220px]" />
        <span className="mb-16 sm:mb-24">
          <Twinkle mood="stars" size={84} />
        </span>
        <Kid who="orbit" pose="cheer" height={170} className="sm:!h-[220px]" />
      </div>
      <MissionCard className="pt-10 text-center sm:pt-12">
        <p className="font-bold tracking-wide text-muted">SOL 500 · MISSION COMPLETE</p>
        <h1 className="font-display text-[26px] leading-tight font-extrabold sm:text-[32px]">{text.title}</h1>
        <p className="mt-1 flex flex-wrap items-center justify-center gap-x-3 font-bold">
          <span>Rank: {text.rank}</span>
          <Stars n={game.stars} />
          <span>{healthy.length} of 4 systems healthy</span>
        </p>
        <p className="mt-3 text-lg">{text.line}</p>
      </MissionCard>
      <Meters meters={game.meters} />
      <MissionCard>
        <h2 className="font-display text-xl font-bold">What you learned</h2>
        <ul className="mt-2 space-y-3">
          {LEVELS.map((l) => (
            <li key={l.id} className="flex gap-2">
              <Award size={22} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
              <span>
                “{l.learned}”<span className="block text-sm text-muted">Source: {l.source}</span>
              </span>
            </li>
          ))}
        </ul>
      </MissionCard>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Crew Mode', 'Next time, you and your friends each take one of these roles.'],
          ['More worlds', 'New missions beyond Mars.'],
        ].map(([t, d]) => (
          <MissionCard key={t} className="opacity-80">
            <p className="flex items-center gap-2 font-display text-lg font-bold">
              <Lock size={18} strokeWidth={2} aria-hidden /> {t}
            </p>
            <p>{d} Coming soon.</p>
          </MissionCard>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <PrimaryButton onClick={() => startMission()}>Fly the mission again</PrimaryButton>
        <QuietButton onClick={goHome}>Home</QuietButton>
      </div>
    </Sky>
  );
}

export default function App() {
  const screen = useGame((s) => s.screen);
  if (screen === 'hook') return <Hook />;
  if (screen === 'story') return <Story />;
  if (screen === 'map') return <MissionMap />;
  if (screen === 'level') return <LevelOpening />;
  if (screen === 'play') return <Play />;
  if (screen === 'replay') return <Replay />;
  if (screen === 'success') return <Success />;
  return <Home />;
}
