// The play screen, in the three landscape zones (BUILD_SEQUENCE.md §4.2, R3).
// Top strip: the HUD. Left: your kid and Twinkle, reacting. Right: Twinkle's bubble on top, the thing you touch
// under it (three choice cards with Look first, or a hands-on step), the source line at the bottom.
// After GO the cards slide away and the result (what happened, the chips, Next) takes their place.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CircleHelp, Globe, Rocket, Settings, Sparkles, X } from 'lucide-react';
import { Decision, optionCosts } from '../components/Decision';
import { ChangeChip, GameButton, RoundButton } from '../components/GameButton';
import { LEVEL_SCENE, LevelHud, LevelZones, outcomeChanges, tasksFor, totalChange } from '../components/LevelChrome';
import { MeterBadge } from '../components/meters';
import { flyToHud } from '../components/motion';
import { Panel, SourceLinks, SourceStrip, TaskList } from '../components/Panel';
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
import { useWallet } from '../store/wallet';
import { t, tMission, useI18n } from '../content/i18n';
import { CrisisEarth3D } from '../components/3d/CrisisEarth3D';
import { HeroCadetRocket3D } from '../components/3d/HeroCadetRocket3D';
import { MissionSettingsModal } from '../components/MissionSettingsModal';
import { BonusRound } from '../components/BonusRound';

export const HINT_COST = 5;

/** Plain-language "what is this question asking?" so the player understands it before paying for a hint. */
function explainStep(step: Level['steps'][number], lang: string): string {
  const bn = lang === 'bn';
  switch (step.kind) {
    case 'choice':
      return bn
        ? 'এখানে একটি বিকল্প বেছে নিতে হবে। প্রতিটি বিকল্প তোমার চারটি মিটার (শক্তি, বাতাস ও পানি, খাবার, সুরক্ষা) বাড়ায় বা কমায়। কোনটি শূন্য হলে মিশন বিপদে পড়ে।'
        : 'You pick one option. Every option raises or lowers your four meters (Power, Air & Water, Food, Shield). If any meter hits zero, the mission is in danger.';
    case 'crates':
      return bn
        ? 'প্রতিটি ক্রেট একটি মিটারে রাখো। যে মিটার সবচেয়ে কম, সেটি আগে ভরলে মহাকাশযান বেশি দিন টিকবে।'
        : 'Place each crate into a meter bin. Filling the meter that is lowest first keeps your spaceship alive for longer.';
    case 'stow':
      return bn
        ? 'সীমিত জায়গা, তাই কিছু জিনিস হাতের কাছে আর বাকিগুলো গভীরে রাখতে হবে। জরুরি জিনিস হাতের কাছে রাখলে দ্রুত পাওয়া যায়।'
        : 'You have limited seat space, so some items go within reach and the rest deep in the hold. Things you need in a hurry belong within reach.';
    case 'order':
      return bn
        ? 'কাজগুলো সঠিক ক্রমে সাজাও। ভুল ক্রমে করলে মিটারের ক্ষতি হবে।'
        : 'Put the actions in the correct order. A wrong order costs you meter points.';
    default:
      return bn
        ? 'প্রশ্নটি মনোযোগ দিয়ে পড়ো, তারপর মিটারগুলোর দিকে নজর রেখে সিদ্ধান্ত নাও।'
        : 'Read the question carefully, then decide while keeping an eye on your meters.';
  }
}

/** Twinkle's help card: explains the question, then (for stardust) reveals the hint. Never says which to pick. */
function Hint({
  step,
  game,
  level,
  revealed,
  onReveal,
  onClose,
}: {
  step: Level['steps'][number];
  game: GameState;
  level: Level;
  revealed: boolean;
  onReveal: () => void;
  onClose: () => void;
}) {
  const lang = useI18n((s) => s.lang);
  const dust = useWallet((s) => s.stardust);
  const bn = lang === 'bn';
  const lowest = METERS.reduce((a, b) => (game.meters[b] < game.meters[a] ? b : a));
  const costs = step.kind === 'choice' ? optionCosts(step as ChoiceStep, game, level) : [];
  const canAfford = dust >= HINT_COST;
  return (
    <Panel ribbon={bn ? 'টুইঙ্কলের সাহায্য' : "Twinkle's help"} tone="space" compact className="!absolute inset-x-0 top-0 bottom-0 z-20 !mt-0 !bg-panel">
      <button onClick={onClose} aria-label="Hide hint" className="absolute top-[0.125rem] right-[0.25rem] z-10 grid h-[2.75rem] w-[2.75rem] place-items-center rounded-full text-text cursor-pointer">
        <X size={22} strokeWidth={3} />
      </button>
      <div className="h-full overflow-y-auto pr-1">
        <div className="flex items-start gap-[0.75rem]">
          <Twinkle mood="question" size={48} />
          <div className="min-w-0">
            <p className="font-display text-[0.75rem] font-black tracking-wider text-amber-300 uppercase">
              {bn ? 'প্রশ্নটি কী বলছে?' : 'What is this question about?'}
            </p>
            <p className="text-[0.9375rem] leading-snug font-bold">{tMission(step.prompt)}</p>
            <p className="mt-[0.25rem] text-[0.875rem] leading-snug text-muted">{explainStep(step, lang)}</p>
          </div>
        </div>

        {revealed ? (
          <div className="mt-[0.5rem] border-t-2 border-line pt-[0.5rem]">
            <p className="font-display text-[0.75rem] font-black tracking-wider text-go uppercase">{bn ? 'ইঙ্গিত' : 'Hint'}</p>
            <p className="text-[0.9375rem] leading-snug">{tMission(step.hint)}</p>
            <p className="mt-[0.25rem] flex flex-wrap items-center gap-[0.375rem] font-display text-[1rem] font-extrabold">
              {bn ? 'সবচেয়ে কম:' : 'Lowest:'} <MeterBadge meter={lowest} size={24} /> {METER_NAMES[lowest]} ({game.meters[lowest]}).
            </p>
            {costs.length ? (
              <ul className="mt-[0.5rem] space-y-[0.375rem]" aria-label="What each choice costs">
                {costs.map(({ option, changes }) => {
                  const Icon = iconFor(option.label);
                  return (
                    <li key={option.label} className="flex items-center gap-[0.5rem]">
                      <span className="grid h-[2rem] w-[2rem] shrink-0 place-items-center rounded-[0.5rem] border-2 border-line bg-space" aria-hidden>
                        <Icon size={18} strokeWidth={2.25} />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-display text-[0.9375rem] leading-tight font-bold">{tMission(option.label)}</span>
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
        ) : (
          <div className="mt-[0.625rem] rounded-xl border-2 border-dashed border-amber-400/60 bg-amber-500/10 p-[0.625rem] text-center">
            <button
              type="button"
              onClick={onReveal}
              disabled={!canAfford}
              className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-4 font-display text-[0.9375rem] font-black text-black shadow-[0_0.25rem_0_#a16207] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <Sparkles size={18} />
              {bn ? `ইঙ্গিত দেখো (${HINT_COST} ✦)` : `Reveal hint (${HINT_COST} ✦)`}
            </button>
            <p className="mt-[0.375rem] text-[0.8125rem] text-muted">
              {canAfford
                ? bn
                  ? `তোমার আছে ${dust} ✦`
                  : `You have ${dust} ✦`
                : bn
                  ? `আরও ${HINT_COST - dust} ✦ লাগবে। ফ্লাই বা আর্কেডে খেলে স্টারডাস্ট জমাও!`
                  : `Need ${HINT_COST - dust} more ✦. Earn stardust in Fly or the Arcade!`}
            </p>
          </div>
        )}

        <div className="mt-[0.625rem] border-t-2 border-line pt-[0.375rem] text-[0.8125rem] text-muted">
          <SourceLinks text={level.source} />
        </div>
      </div>
    </Panel>
  );
}

export function Play() {
  const { game, levelIndex, stepIndex, outcome, act, next, retryStep, log } = useGame();
  const lang = useI18n((s) => s.lang);
  const [hint, setHint] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Set<string>>(() => new Set());
  const hintKey = `${levelIndex}-${stepIndex}`;
  const [showBonus, setShowBonus] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [active3DTab, setActive3DTab] = useState<'earth' | 'rocket'>('earth');
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
    <Scene
      bare
      place={LEVEL_SCENE[level.id]}
      top={
        <LevelHud
          meters={hudPreview ?? game.meters}
          stars={game.stars - held}
          look={look ?? undefined}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      }
    >
      <LevelZones left={left}>
        {toy ? (
          <ToyHost levelId={level.id} learned={level.learned} onDone={() => setToyDone(true)} />
        ) : (
          <>
        <div className="flex items-end gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Bubble
            className="mb-1 min-w-0 flex-1 text-sm sm:text-base mr-2"
            speak={step.kind === 'choice' ? `${tMission(step.prompt)} ${(step as ChoiceStep).options.map((o) => tMission(o.label)).join('. ')}.` : tMission(step.prompt)}
          >
            {step.kind === 'choice' ? tMission(captionFor(step.prompt)) : tMission(step.prompt)}
          </Bubble>

          <div className="flex items-center gap-1.5 shrink-0">
            <RoundButton
              icon={Globe}
              label={t('play.3dView')}
              pressed={show3DModal}
              onClick={() => setShow3DModal(true)}
            />

            {!outcome ? (
              <RoundButton
                icon={CircleHelp}
                label={hint ? t('play.hideHint') : t('play.askTwinkle')}
                pressed={hint}
                onClick={() => setHint(!hint)}
              />
            ) : null}

            <RoundButton
              icon={Settings}
              label={lang === 'bn' ? 'সেটিংস' : 'Settings'}
              pressed={showSettingsModal}
              onClick={() => setShowSettingsModal(true)}
            />
          </div>
        </div>

        <div className="relative min-h-max md:min-h-0 flex-1 flex flex-col">
          {outcome ? (
            <div ref={resultRef} className="rise flex h-full min-h-0 flex-col gap-[0.5rem]">
              <ResultMoment
                label={tMission(chosenLabel)}
                outcome={outcome}
                changes={changes}
                fallback={ChosenIcon}
                ribbon={reaction === 'good' ? (lang === 'bn' ? 'চমৎকার!' : 'Nice!') : (lang === 'bn' ? 'কী ঘটল' : 'What happened')}
                tone={reaction === 'good' ? 'good' : 'danger'}
              />
              <div className="flex justify-end">
                <GameButton
                  variant="go"
                  icon={last && !retryStep ? Rocket : ArrowRight}
                  className="!min-h-[3rem] !px-4 sm:!px-6 !text-base sm:!text-xl leading-snug break-words"
                  onClick={() => {
                    setHint(false);
                    if (last && !retryStep) {
                      setShowBonus(true);
                    } else {
                      next();
                    }
                  }}
                >
                  {retryStep ? t('play.tryLandingAgain') : last ? (levelIndex + 1 >= LEVELS.length ? t('play.finishMission') : t('play.nextLevel')) : t('play.next')}
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
          {hint && !outcome ? <Hint
              step={step}
              game={game}
              level={level}
              revealed={revealedHints.has(hintKey)}
              onReveal={() => {
                if (useWallet.getState().spend(HINT_COST)) setRevealedHints((p) => new Set(p).add(hintKey));
              }}
              onClose={() => setHint(false)}
            /> : null}
        </div>

        <SourceStrip text={level.source} className="shrink-0 mt-1" />
          </>
        )}
      </LevelZones>

      {/* Quick Settings & Audio/Language Modal Available Anytime During Missions */}
      <MissionSettingsModal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* 3D Earth Crisis & Hero Rocket Modal */}
      {show3DModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/90 p-3 sm:p-5 backdrop-blur-md">
          <div className="relative flex h-full max-h-[34rem] w-full max-w-[48rem] flex-col overflow-hidden rounded-2xl border-2 border-line bg-panel p-3 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line/60 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActive3DTab('earth')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    active3DTab === 'earth' ? 'bg-go text-go-text shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  <Globe size={15} />
                  <span>{lang === 'bn' ? 'বিপন্ন পৃথিবী ৩ডি' : 'Earth in Danger 3D'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActive3DTab('rocket')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    active3DTab === 'rocket' ? 'bg-go text-go-text shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  <Rocket size={15} />
                  <span>{lang === 'bn' ? 'মহাকাশযান প্রস্তুতি ৩ডি' : 'Spaceship Prep 3D'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShow3DModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-space-deep text-muted hover:text-text transition cursor-pointer"
                aria-label={t('btn.close')}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* 3D Scene Viewport */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl pt-2">
              {active3DTab === 'earth' ? (
                <CrisisEarth3D />
              ) : (
                <HeroCadetRocket3D />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-line/60 pt-2 text-xs text-muted">
              <span>{lang === 'bn' ? '👆 ৩ডি মডেল ঘোরাতে ড্র্যাগ বা সোয়াইপ করো' : '👆 Drag / swipe to rotate the 3D scene in real-time'}</span>
              <button
                type="button"
                onClick={() => setShow3DModal(false)}
                className="rounded-xl border border-line bg-panel-up px-4 py-1.5 font-display text-xs font-bold text-text hover:bg-panel transition cursor-pointer"
              >
                {t('btn.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bonus Mini-Game Round (Triggered after last step before victory crate) */}
      {showBonus && (
        <BonusRound
          levelIndex={levelIndex}
          onComplete={(_earned) => {
            setShowBonus(false);
            next();
          }}
          onSkip={() => {
            setShowBonus(false);
            next();
          }}
        />
      )}
    </Scene>
  );
}
