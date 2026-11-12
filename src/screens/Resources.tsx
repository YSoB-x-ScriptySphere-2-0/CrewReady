// Resources screen — BUILD_SEQUENCE.md S4 / plan.md §7 row 4
import { useState, useEffect } from 'react';
import {
  Zap,
  Droplet,
  Apple,
  ShieldAlert,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Rocket,
  Plane,
} from 'lucide-react';
import { useGame } from '../store/game';
import { getFlyStats, spendStardust } from '../fly/storage';
import { t, useI18n } from '../content/i18n';
import {
  loadUpgrades,
  countTotalSlots,
  getSystemStatus,
  checkPurchase,
  buyCargoUpgrade,
  refundAllCargo,
  applyResourcesToGameState,
  MAX_CARGO_SLOTS,
  type MeterKey,
  type UpgradesState,
} from '../engine/resources';

interface SystemConfig {
  key: MeterKey;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  fact: string;
  source: string;
}

const SYSTEMS: SystemConfig[] = [
  {
    key: 'P',
    name: 'Power Grid',
    color: '#F5B700',
    icon: Zap,
    fact: 'Mars gets less than half the sunlight Earth does.',
    source: 'NASA Mars facts',
  },
  {
    key: 'L',
    name: 'Air & Water',
    color: '#1E9BE0',
    icon: Droplet,
    fact: 'The Space Station now recycles about 98% of its water.',
    source: 'NASA ECLSS release (2023)',
  },
  {
    key: 'F',
    name: 'Food Supply',
    color: '#2FA84F',
    icon: Apple,
    fact: 'Astronauts ate lettuce grown on the Space Station for the first time in August 2015.',
    source: 'NASA Veggie pages; OSDR Veggie studies',
  },
  {
    key: 'S',
    name: 'Radiation Shield',
    color: '#7A5AE0',
    icon: ShieldAlert,
    fact: 'Water and food are good radiation shields, so crews plan to shelter behind their supplies.',
    source: 'NASA Orion storm-shelter and space radiation pages; NTRS',
  },
];

export function Resources() {
  const lang = useI18n((s) => s.lang);
  const [upgrades, setUpgrades] = useState<UpgradesState>(() => loadUpgrades());
  const [stardust, setStardust] = useState<number>(() => getFlyStats().totalStardust);

  useEffect(() => {
    setUpgrades(loadUpgrades());
    setStardust(getFlyStats().totalStardust);
  }, []);

  const totalSlotsUsed = countTotalSlots(upgrades);
  const isBayFull = totalSlotsUsed >= MAX_CARGO_SLOTS;

  const handleBuy = (meter: MeterKey) => {
    const res = buyCargoUpgrade(meter, spendStardust);
    if (res.success) {
      setUpgrades(loadUpgrades());
      setStardust(getFlyStats().totalStardust);
    }
  };

  const handleRefund = () => {
    refundAllCargo((refunded) => {
      // Stardust restored
      const stats = getFlyStats();
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('crewready_fly_total_stardust', (stats.totalStardust + refunded).toString());
        }
      } catch {
        // Ignore quota issues
      }
    });
    setUpgrades(loadUpgrades());
    setStardust(getFlyStats().totalStardust);
  };

  const handleLaunchMission = () => {
    const { startMission } = useGame.getState();
    startMission();
    const currentGame = useGame.getState().game;
    const upgradedGame = applyResourcesToGameState(currentGame);
    useGame.setState({ game: upgradedGame, checkpoint: upgradedGame });
  };

  // Build cargo slots array
  const cargoSlots: { meter: MeterKey; tier: number }[] = [];
  (['P', 'L', 'F', 'S'] as MeterKey[]).forEach((m) => {
    const t = upgrades[m] || 0;
    for (let i = 0; i < t; i++) {
      cargoSlots.push({ meter: m, tier: i + 1 });
    }
  });

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto bg-space p-3 text-text sm:p-5 select-none font-sans">
      {/* Top Header Strip */}
      <header className="flex flex-shrink-0 items-center justify-between gap-3 border-b-2 border-line/40 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => useGame.getState().go('home')}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-line bg-panel/80 px-3 py-1.5 text-xs font-bold text-muted transition hover:bg-panel hover:text-text active:translate-y-0.5"
            aria-label={t('nav.home')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.home')}</span>
          </button>
          <div>
            <h1 className="font-display text-base sm:text-2xl font-extrabold uppercase tracking-wider text-text">
              {t('resources.title')}
            </h1>
            <p className="text-[11px] text-muted sm:text-xs">
              {t('resources.subtitle')}
            </p>
          </div>
        </div>

        {/* Stardust Bank & Fly Shortcut */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-star/40 bg-panel px-3 py-1 font-display text-xs font-extrabold text-star sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{stardust} ✦</span>
          </div>

          <button
            onClick={() => useGame.getState().go('fly')}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-panel/70 px-3 py-1 text-xs font-bold text-muted transition hover:bg-panel hover:text-text"
            title={lang === 'bn' ? 'ফ্লাই রানারে স্টারডাস্ট আয় করো' : 'Earn stardust in Fly runner'}
          >
            <Plane className="h-3.5 w-3.5 text-go" />
            <span className="hidden md:inline">{lang === 'bn' ? 'স্টারডাস্ট আয়' : 'Earn in Fly'}</span>
          </button>
        </div>
      </header>

      {/* Cargo Slots Bay (Top Bar) */}
      <div className="my-2.5 flex flex-shrink-0 flex-col gap-2 rounded-2xl border-2 border-line bg-panel/75 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-go" />
          <div className="flex flex-col">
            <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text">
              Cargo Bay Slots ({totalSlotsUsed} / {MAX_CARGO_SLOTS})
            </span>
            <span className="text-[11px] text-muted">
              {isBayFull ? 'Rocket is full! 4 of 4 cargo slots packed.' : 'Empty slots available for systems.'}
            </span>
          </div>
        </div>

        {/* Visual Slots Container */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: MAX_CARGO_SLOTS }).map((_, idx) => {
              const packed = cargoSlots[idx];
              if (packed) {
                const sys = SYSTEMS.find((s) => s.key === packed.meter);
                return (
                  <div
                    key={idx}
                    className="flex h-9 w-14 sm:h-10 sm:w-16 items-center justify-center gap-1 rounded-xl border-2 font-display text-xs font-extrabold text-space-deep shadow-sm"
                    style={{ backgroundColor: sys?.color ?? '#22D7E6', borderColor: sys?.color ?? '#22D7E6' }}
                    title={`${sys?.name} +5 Cargo Slot`}
                  >
                    <span>+5</span>
                    <span className="text-[10px] uppercase font-mono">{packed.meter}</span>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className="flex h-9 w-14 sm:h-10 sm:w-16 items-center justify-center rounded-xl border-2 border-dashed border-line/60 bg-space/40 text-[10px] font-bold text-muted/70"
                >
                  Empty
                </div>
              );
            })}
          </div>

          {totalSlotsUsed > 0 && (
            <button
              onClick={handleRefund}
              className="inline-flex items-center gap-1 rounded-xl border-2 border-line bg-panel px-2.5 py-1.5 text-xs font-bold text-muted hover:border-text hover:text-text active:translate-y-0.5"
              title={t('resources.refund')}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'খালি করো' : 'Unload'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Systems Cards Grid */}
      <div className="grid flex-grow grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 min-h-0">
        {SYSTEMS.map((sys) => {
          const status = getSystemStatus(sys.key, upgrades);
          const check = checkPurchase(sys.key, upgrades, stardust);
          const Icon = sys.icon;
          const currentMeterValue = 40 + status.bonus;

          return (
            <div
              key={sys.key}
              className="flex flex-col justify-between rounded-2xl border-2 bg-panel/90 p-3 sm:p-3.5 transition"
              style={{ borderColor: status.tier > 0 ? sys.color : 'var(--color-line, #3A4A8C)' }}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-space-deep shadow-sm"
                      style={{ backgroundColor: sys.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-sm sm:text-base font-extrabold text-text">
                        {sys.name}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        Base: 40 {status.bonus > 0 ? `+ ${status.bonus} = ${currentMeterValue}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Tier Indicator Pill */}
                  <div
                    className="rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase font-display"
                    style={{ borderColor: sys.color, color: sys.color }}
                  >
                    Tier {status.tier}/2
                  </div>
                </div>

                {/* Sourced Kid Fact */}
                <p className="mt-2.5 text-xs leading-relaxed text-muted line-clamp-3">
                  {sys.fact}
                </p>
                <div className="mt-1 text-[10px] font-bold text-muted/70">
                  {sys.source}
                </div>
              </div>

              {/* Upgrade Action Footer */}
              <div className="mt-3 border-t border-line/40 pt-2.5">
                <button
                  disabled={!check.allowed}
                  onClick={() => handleBuy(sys.key)}
                  className={`w-full rounded-xl border-2 py-2 px-2.5 text-center font-display text-xs sm:text-sm font-extrabold tracking-wide transition leading-snug break-words ${
                    check.allowed
                      ? 'border-go bg-go text-go-text shadow-[0_0.25rem_0_#0F8F9C] hover:brightness-105 active:translate-y-0.5 active:shadow-none'
                      : 'border-line/40 bg-panel-up/60 text-muted/60 cursor-not-allowed'
                  }`}
                >
                  {check.allowed
                    ? `+5 ${sys.name} (25 ✦)`
                    : isBayFull
                      ? t('resources.full')
                      : check.reason.includes('Need')
                        ? (lang === 'bn' ? 'দরকার ২৫ ✦' : 'Need 25 ✦')
                        : (lang === 'bn' ? 'সর্বোচ্চ র‍্যাংক' : 'Max Rank')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <footer className="mt-3 flex flex-shrink-0 items-center justify-between border-t-2 border-line/40 pt-3">
        <span className="text-[11px] text-muted max-w-[60%] leading-tight">
          {lang === 'bn'
            ? 'প্যাক করা সমস্ত উপাদান পরবর্তী মিশনের শুরুতে স্বয়ংক্রিয়ভাবে যুক্ত হবে।'
            : 'All packed resources automatically apply to your next mission start.'}
        </span>

        <button
          onClick={handleLaunchMission}
          className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl border-2 border-go bg-go px-4 sm:px-6 py-2 font-display text-xs sm:text-base font-extrabold uppercase tracking-wide text-go-text shadow-[0_0.25rem_0_#0F8F9C,0_0_1.25rem_rgba(34,215,230,0.45)] transition hover:brightness-105 active:translate-y-0.5 active:shadow-none leading-snug break-words"
        >
          <Rocket className="h-4 w-4 shrink-0" />
          <span>{t('resources.launch')}</span>
        </button>
      </footer>
    </div>
  );
}
