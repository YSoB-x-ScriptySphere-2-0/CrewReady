import { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { spaceMusic } from '../services/audio';

export function MusicToggle({
  className = '',
  compact = false,
  showLabel = true,
}: {
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
}) {
  const [muted, setMuted] = useState(() => spaceMusic.getMuted());
  const [playing, setPlaying] = useState(() => spaceMusic.getPlaying());

  useEffect(() => {
    return spaceMusic.subscribe((isPlaying, isMuted) => {
      setPlaying(isPlaying);
      setMuted(isMuted);
    });
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Start music if not started yet
    if (!playing) {
      spaceMusic.play();
    }
    const newMuted = spaceMusic.toggleMute();
    setMuted(newMuted);
  };

  const isActive = playing && !muted;

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={isActive ? 'Mute space music' : 'Play space music'}
        aria-label={isActive ? 'Mute background music' : 'Unmute background music'}
        className={`group relative grid h-[2.75rem] w-[2.75rem] cursor-pointer place-items-center rounded-full border border-white/20 bg-panel/80 text-text shadow-sm backdrop-blur-md transition hover:border-go/50 hover:bg-panel active:scale-95 ${
          isActive ? 'text-go border-go/40 shadow-[0_0_12px_rgba(34,215,230,0.3)]' : 'text-muted/60'
        } ${className}`}
      >
        {isActive ? (
          <Volume2 size={18} strokeWidth={2.4} className="animate-pulse" />
        ) : (
          <VolumeX size={18} strokeWidth={2.2} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isActive ? 'Mute space music' : 'Play space music'}
      aria-label={isActive ? 'Mute background music' : 'Play space music'}
      className={`group flex min-h-[2.5rem] cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-panel/85 px-3 py-1 font-display text-xs font-bold text-text shadow-sm backdrop-blur-md transition hover:border-go/50 hover:bg-panel active:scale-95 ${
        isActive ? 'border-go/40 text-go shadow-[0_0_14px_rgba(34,215,230,0.25)]' : 'text-muted hover:text-text'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isActive ? (
          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span className="w-0.5 bg-go rounded-full animate-[bounce_0.8s_infinite] h-2" />
            <span className="w-0.5 bg-go rounded-full animate-[bounce_0.6s_infinite_0.2s] h-3.5" />
            <span className="w-0.5 bg-go rounded-full animate-[bounce_0.7s_infinite_0.4s] h-2.5" />
          </div>
        ) : (
          <Music size={14} className="text-muted/60" />
        )}
      </div>

      {showLabel && (
        <span className="font-extrabold uppercase tracking-wider text-[0.6875rem]">
          {isActive ? 'Music ON' : 'Music OFF'}
        </span>
      )}
    </button>
  );
}
