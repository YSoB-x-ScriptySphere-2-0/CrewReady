// Success and the Outpost Check, restyled in G2: the dawn scene, a reward crate that pops out the result badge,
// the crew cheering, and the six "I learned" lines as collected badges you tap to read. A9 builds on this.
import { useState } from 'react';
import { Check, Crown, House, Lock, Medal, Rocket, Shield, type LucideIcon } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { MeterPill, StarCounter } from '../components/Hud';
import { usePress } from '../components/motion';
import { Panel } from '../components/Panel';
import { PrizeBadge, RewardCrate } from '../components/RewardCrate';
import { Scene } from '../components/Scene';
import { Kid, Twinkle } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
import { HEALTHY, outpostCheck } from '../engine/engine';
import { METERS } from '../engine/types';
import { useGame } from '../store/game';

const RESULT_TEXT: Record<string, { title: string; rank: string; line: string; icon: LucideIcon }> = {
  survives: { title: 'Outpost Survives', rank: 'Cadet', line: 'You made it! The base is weak. The next crew has work to do.', icon: Shield },
  stable: { title: 'Outpost Stable', rank: 'Pilot', line: 'The base can hold on until the next rocket comes.', icon: Medal },
  thriving: { title: 'Outpost Thriving', rank: 'Commander', line: 'Earth is cheering. People now have a second home.', icon: Crown },
};

function LessonBadge({ n, open, onClick }: { n: number; open: boolean; onClick: () => void }) {
  const press = usePress();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={open}
      aria-label={`What you learned in level ${n}`}
      {...press}
      className={`toy !mb-[7px] grid h-14 w-14 place-items-center rounded-full font-display text-2xl font-extrabold ${
        open ? 'bg-go text-white [--lip:var(--color-go-lip)]' : 'bg-star text-ink [--lip:#a87400]'
      }`}
    >
      {n}
    </button>
  );
}

export function Success() {
  const { game, startMission, goHome } = useGame();
  const { healthy, result } = outpostCheck(game);
  const text = RESULT_TEXT[result];
  const [lesson, setLesson] = useState(0);
  const l = LEVELS[lesson];

  return (
    <Scene place="dawn">
      <header className="flex items-center justify-between gap-3">
        <p className="font-display text-xl font-extrabold">Sol 500 · Mission complete</p>
        <StarCounter n={game.stars} />
      </header>

      <div className="relative flex items-end justify-center gap-1 sm:gap-6">
        <Kid who="nova" pose="cheer" height={150} bob className="sm:!h-[200px]" />
        <RewardCrate label={`${text.title}. Rank: ${text.rank}.`}>
          <PrizeBadge sub={text.rank}>
            <text.icon size={40} strokeWidth={2.5} aria-hidden />
          </PrizeBadge>
        </RewardCrate>
        <Kid who="orbit" pose="cheer" height={150} bob className="sm:!h-[200px]" />
      </div>

      <Panel ribbon="Outpost check" tone="go" className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Twinkle mood="stars" size={64} />
          <p className="font-display text-[26px] leading-tight font-extrabold sm:text-[32px]">{text.title}</p>
        </div>
        <p className="mt-2 text-lg">{text.line}</p>
        <p className="mt-2 font-display text-lg font-bold">
          Rank: {text.rank} · {healthy.length} of 4 systems healthy
        </p>
        <div className="mt-4 grid grid-cols-2 gap-x-2.5 gap-y-3 text-left sm:grid-cols-4">
          {METERS.map((m) => (
            <div key={m} className="relative">
              <MeterPill meter={m} value={game.meters[m]} />
              {game.meters[m] >= HEALTHY ? (
                <span className="absolute -top-2 -right-1 grid h-7 w-7 place-items-center rounded-full border-[3px] border-ink bg-good text-white" aria-label="healthy">
                  <Check size={15} strokeWidth={4} aria-hidden />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>

      <Panel ribbon="What you learned" tone="ink">
        <p className="text-base text-muted">Six badges. Tap one to read it.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {LEVELS.map((lv, i) => (
            <LessonBadge key={lv.id} n={lv.id} open={lesson === i} onClick={() => setLesson(i)} />
          ))}
        </div>
        <div key={lesson} className="anim-pop-in mt-2 rounded-tile border-[3px] border-ink bg-white p-3" aria-live="polite">
          <p className="font-display text-sm font-bold text-muted uppercase">
            Level {l.id} · {l.title}
          </p>
          <p className="mt-1 text-lg leading-snug">“{l.learned}”</p>
          <p className="mt-2 text-sm text-muted">Source: {l.source}</p>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Crew Mode', 'Next time, you and your friends each take one of these roles.'],
          ['More worlds', 'New missions beyond Mars.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-panel border-[3px] border-dashed border-ink bg-locked p-4 text-ink">
            <p className="flex items-center gap-2 font-display text-xl font-extrabold">
              <span className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-paper">
                <Lock size={18} strokeWidth={3} aria-hidden />
              </span>
              {t}
            </p>
            <p className="mt-1 text-lg">{d} Coming soon.</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <GameButton variant="go" icon={Rocket} onClick={() => startMission()}>
          Fly the mission again
        </GameButton>
        <GameButton variant="plain" icon={House} onClick={goHome}>
          Home
        </GameButton>
      </div>
    </Scene>
  );
}
