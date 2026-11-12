// Hidden dev page (#kit): every G1 game-kit part in every state, for screenshots and checks.
// Not linked from the game. BUILD_SEQUENCE.md step G1.
import { useState } from 'react';
import { FlaskConical, House, Play, RotateCw, Rocket, Award, Star as StarLucide, Zap } from 'lucide-react';
import { AlarmBanner } from '../components/AlarmBanner';
import { Dock } from '../components/Dock';
import { ChangeChip, ChoiceTile, GameButton, type TileState } from '../components/GameButton';
import { FloatChip, Hud, MeterPill, StarCounter } from '../components/Hud';
import { flyToHud, setReducedMotion, useReducedMotion } from '../components/motion';
import { Badge, IntelCard, Panel, Ribbon, SourceLine, TaskList, type BadgeKind } from '../components/Panel';
import { PrizeBadge, RewardCrate } from '../components/RewardCrate';
import { Scene, type ScenePlace } from '../components/Scene';
import { Kid, kidPose, Twinkle, TwinkleSays, TWINKLE_FOR, type Reaction, type TwinkleMood } from '../components/Twinkle';
import type { Meter } from '../engine/types';
import neows from '../content/samples/neows.json';

const PLACES: ScenePlace[] = ['earth', 'space', 'mars', 'dust', 'alarm', 'dawn'];
const MOODS: TwinkleMood[] = ['happy', 'neutral', 'question', 'worried', 'sad', 'stars', 'surprised', 'tablet', 'wink', 'hearts', 'squint', 'sleepy'];
const BADGES: BadgeKind[] = ['NASA LIVE', 'NASA ARCHIVE', 'GAME ESTIMATE', 'FICTION'];
const REACTIONS: Reaction[] = ['choosing', 'good', 'small-loss', 'big-loss'];

const fetched = new Date(neows.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const OPTIONS = [
  { label: 'Build a shelter and wait', icon: House, costs: [{ meter: 'S' as const, amount: -10 }, { meter: 'F' as const, amount: -5 }, { meter: 'P' as const, amount: -5 }] },
  { label: 'Keep working on the experiment', icon: FlaskConical, costs: [{ meter: 'stars' as const, amount: 2 }, { meter: 'S' as const, amount: -25 }] },
  { label: 'Turn the ship and power down', icon: RotateCw, costs: [{ meter: 'S' as const, amount: -15 }, { meter: 'P' as const, amount: -15 }] },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel ribbon={title} tone="ink">
      {children}
    </Panel>
  );
}

export function Kit() {
  const reduce = useReducedMotion();
  const [meters, setMeters] = useState<Record<Meter, number>>({ P: 60, L: 40, F: 18, S: 75 });
  const [stars, setStars] = useState(3);
  const [chosen, setChosen] = useState<number | null>(null);
  const [toggles, setToggles] = useState<boolean[]>([true, false]);
  const [alarmKey, setAlarmKey] = useState(0);
  const [crateKey, setCrateKey] = useState(0);
  const [crateDone, setCrateDone] = useState(false);
  const [reaction, setReaction] = useState<Reaction>('choosing');
  const [chipKey, setChipKey] = useState(0);

  const bump = (m: Meter, d: number) => setMeters((v) => ({ ...v, [m]: Math.max(0, Math.min(100, v[m] + d)) }));
  const tileState = (i: number): TileState => (chosen === null ? 'idle' : chosen === i ? 'chosen' : 'gone');

  return (
    <Scene
      place="space"
      top={<Hud meters={meters} stars={stars} lead={<Ribbon tone="go">Game kit</Ribbon>} />}
      bottom={<Dock />}
    >
      <Panel ribbon="Controls" tone="go">
        <p className="text-lg">Hidden dev page. Every part, every state.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <GameButton variant="small" onClick={() => setReducedMotion(!reduce)} ariaLabel={`Reduced motion is ${reduce ? 'on' : 'off'}`}>
            Reduced motion: {reduce ? 'ON' : 'OFF'}
          </GameButton>
        </div>
      </Panel>

      <Section title="Hud">
        <p>Tap to change the meters and stars. Losses shake and flash red; gains pop.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <GameButton variant="small" onClick={() => bump('P', -15)}>Power −15</GameButton>
          <GameButton variant="small" onClick={() => bump('L', 10)}>Air +10</GameButton>
          <GameButton variant="small" onClick={() => bump('F', -5)}>Food −5</GameButton>
          <GameButton variant="small" onClick={() => bump('S', 20)}>Shield +20</GameButton>
          <GameButton
            variant="small"
            icon={StarLucide}
            onClick={(e) => {
              const from = e.currentTarget;
              flyToHud(from).then(() => setStars((s) => s + 1));
            }}
          >
            Fly a star
          </GameButton>
        </div>
        <p className="mt-4 font-bold">Single pills (LOW at 20 or below):</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MeterPill meter="P" value={100} />
          <MeterPill meter="L" value={21} />
          <MeterPill meter="F" value={20} />
          <MeterPill meter="S" value={0} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <StarCounter n={12} />
          <div className="relative h-10 w-24">
            <FloatChip key={`a${chipKey}`} d={10} />
          </div>
          <div className="relative h-10 w-24">
            <FloatChip key={`b${chipKey}`} d={-15} />
          </div>
          <GameButton variant="small" onClick={() => setChipKey((k) => k + 1)}>
            Replay chips
          </GameButton>
        </div>
      </Section>

      <Section title="GameButton">
        <div className="flex flex-wrap items-start gap-3">
          <GameButton variant="go" icon={Play}>PLAY</GameButton>
          <GameButton variant="go">GO!</GameButton>
          <GameButton variant="plain">Home</GameButton>
          <GameButton variant="small" icon={Rocket}>Small</GameButton>
          <GameButton variant="go" disabled>Locked</GameButton>
          <GameButton variant="plain" disabled>Locked</GameButton>
        </div>
        <div className="mt-3">
          <GameButton variant="go" full>
            Continue — Level 3
          </GameButton>
        </div>
      </Section>

      <Section title="ChoiceTile">
        <p>Choose one: it stamps, the others slide away.</p>
        <div className="mt-3 space-y-1 overflow-x-clip">
          {OPTIONS.map((o, i) => (
            <ChoiceTile key={o.label} label={o.label} icon={o.icon} costs={o.costs} state={tileState(i)} onClick={() => chosen === null && setChosen(i)} />
          ))}
        </div>
        <GameButton variant="small" icon={RotateCw} onClick={() => setChosen(null)} disabled={chosen === null}>
          Reset tiles
        </GameButton>
        <p className="mt-4 font-bold">Pick-several toggles, with a note, and disabled:</p>
        <div className="mt-2 space-y-1">
          {['Water bags', 'Tool kit'].map((label, i) => (
            <ChoiceTile
              key={label}
              label={label}
              icon={i ? Zap : House}
              note={i ? 'In the hold: patching costs Power' : 'Next to you: the shelter is on time'}
              pressed={toggles[i]}
              onClick={() => setToggles((t) => t.map((v, j) => (j === i ? !v : v)))}
            />
          ))}
          <ChoiceTile label="Full — two items fit" icon={Award} disabled />
        </div>
        <p className="mt-4 font-bold">Change chips:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <ChangeChip change={{ meter: 'P', amount: 10 }} />
          <ChangeChip change={{ meter: 'L', amount: -15 }} />
          <ChangeChip change={{ meter: 'F', amount: 30 }} />
          <ChangeChip change={{ meter: 'S', amount: -5 }} />
          <ChangeChip change={{ meter: 'stars', amount: 2 }} />
        </div>
      </Section>

      <Section title="Panel and Ribbon">
        <div className="space-y-4">
          <Panel ribbon="Level 4 · The dust storm" tone="ink">
            <p className="text-lg">Ink ribbon.</p>
          </Panel>
          <Panel ribbon="Storm alert" tone="danger">
            <p className="text-lg">Danger ribbon.</p>
          </Panel>
          <Panel ribbon="You did it" tone="go">
            <p className="text-lg">Go ribbon.</p>
          </Panel>
          <Panel>
            <p className="text-lg">No ribbon.</p>
          </Panel>
        </div>
      </Section>

      <Section title="TaskList">
        <TaskList tasks={[{ label: 'Pack the rocket', done: true }, { label: 'Pick a cargo seat' }, { label: 'Stow the ship' }]} />
        <div className="mt-4">
          <TaskList variant="strip" tasks={[{ label: 'Pack the rocket', done: true }, { label: 'Pick a cargo seat' }, { label: 'Stow the ship' }]} />
        </div>
        <div className="mt-3">
          <TaskList variant="strip" tasks={[{ label: 'Pack the rocket', done: true }, { label: 'Pick a cargo seat', done: true }, { label: 'Stow the ship', done: true }]} />
        </div>
      </Section>

      <Section title="AlarmBanner">
        <GameButton variant="small" onClick={() => setAlarmKey((k) => k + 1)}>Replay banner</GameButton>
      </Section>
      <div className="-mx-4">
        <AlarmBanner key={`s${alarmKey}`} title="Storm alert!" sub="The blast arrives in one hour" shake={alarmKey > 0} />
      </div>
      <div className="-mx-4">
        <AlarmBanner key={`p${alarmKey}`} title="Mission paused" sub="Nobody is hurt" shake={false} />
      </div>

      <Section title="RewardCrate">
        <RewardCrate
          key={crateKey}
          label="Level 1 badge"
          onDone={() => setCrateDone(true)}
        >
          <PrizeBadge sub="Level 1">
            <Rocket size={40} strokeWidth={2.5} aria-hidden />
          </PrizeBadge>
        </RewardCrate>
        <div className="mt-2 flex items-center gap-3">
          <GameButton
            variant="small"
            onClick={() => {
              setCrateDone(false);
              setCrateKey((k) => k + 1);
            }}
          >
            Replay crate
          </GameButton>
          <span className="font-bold">{crateDone ? 'Done' : 'Opening…'}</span>
        </div>
      </Section>

      <Section title="Characters">
        <p>Tap a reaction: the kid and Twinkle swap pose.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {REACTIONS.map((r) => (
            <GameButton key={r} variant="small" onClick={() => setReaction(r)} className={reaction === r ? '!bg-[#ffe3ec]' : ''}>
              {r}
            </GameButton>
          ))}
        </div>
        <div className="mt-3 flex items-end gap-4">
          <Kid who="orbit" pose={kidPose('orbit', reaction)} height={150} />
          <Kid who="nova" pose={kidPose('nova', reaction)} height={150} />
          <Twinkle mood={TWINKLE_FOR[reaction]} size={80} />
        </div>
        <div className="mt-4">
          <TwinkleSays mood={TWINKLE_FOR[reaction]}>Your lowest meter is Food.</TwinkleSays>
        </div>
        <div className="mt-2">
          <TwinkleSays speaker={<Kid who="orbit" pose="point" height={90} />}>Who do we take?</TwinkleSays>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {MOODS.map((m) => (
            <figure key={m} className="flex flex-col items-center">
              <Twinkle mood={m} size={60} />
              <figcaption className="text-sm text-muted">{m}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Badges and sources">
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>
        <SourceLine text="NASA DONKI + NOAA SWPC · ARCHIVE · 11 May 2024" />
      </Section>

      <IntelCard
        badge="NASA ARCHIVE"
        date={`Real NASA data from ${fetched}`}
        figure={neows.count}
        sentence={`Real asteroids passing Earth this week — NASA is tracking ${neows.count}. None will hit us.`}
        source={`NASA NeoWs · ARCHIVE · ${fetched}`}
      />
      <IntelCard
        badge="GAME ESTIMATE"
        title="Layout check"
        image={{ src: `${import.meta.env.BASE_URL}art/twinkle-tablet.webp`, alt: 'Twinkle holding a data screen', credit: 'Team art (placeholder until B4)' }}
        sentence="Photo frame layout. Real NASA photos arrive in B4."
      />

      <Section title="Scenes">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PLACES.map((p) => (
            <div key={p} className="overflow-hidden rounded-tile border-[3px] border-ink">
              <Scene place={p} fill={false} bare className="h-40">
                <span className="m-2 self-start rounded-full border-2 border-ink bg-paper px-2 font-display text-base font-extrabold text-ink">{p}</span>
              </Scene>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Dock">
        <p>The Dock sits at the bottom of this page. Locked places show a padlock.</p>
      </Section>
    </Scene>
  );
}
