// Motion helpers for the game kit — BUILD_SEQUENCE.md §4.4.
// Every motion is one-shot and tells the kid something. Reduced motion (the OS setting, or the
// in-game setting that A11 adds) keeps every change and colour flash but drops all movement.
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from 'react';

const MQ = '(prefers-reduced-motion: reduce)';
const EVENT = 'crewready:motion';

export function reducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MQ).matches || document.documentElement.dataset.motion === 'reduce';
}

/** The in-game "reduced motion" switch (used by Profile in A11, and by the #kit page). */
export function setReducedMotion(on: boolean) {
  if (on) document.documentElement.dataset.motion = 'reduce';
  else delete document.documentElement.dataset.motion;
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener('change', cb);
  window.addEventListener(EVENT, cb);
  return () => {
    mq.removeEventListener('change', cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, reducedMotion, () => false);
}

/**
 * Squash-on-press for toy buttons: pointer-down (not up) and Enter/Space give the same look.
 * Spread the result onto the element; it sets `data-pressed`, which `.toy` in index.css reads.
 */
export function usePress(disabled?: boolean) {
  const [pressed, setPressed] = useState(false);
  const up = () => setPressed(false);
  return {
    'data-pressed': pressed && !disabled ? 'true' : undefined,
    onPointerDown: (e: PointerEvent) => {
      if (!disabled && e.button === 0) setPressed(true);
    },
    onPointerUp: up,
    onPointerLeave: up,
    onPointerCancel: up,
    onKeyDown: (e: KeyboardEvent) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) setPressed(true);
    },
    onKeyUp: up,
    onBlur: up,
  } as const;
}

/** A number that counts toward its target (tabular figures keep it from wobbling). Jumps with reduced motion. */
export function useCountTo(target: number, ms = 500): number {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || from.current === target) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(a + (target - a) * eased);
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, reduce]);
  return shown;
}

/** Shake the scene once (storm and alarm banners). Does nothing with reduced motion. */
export function shakeScene(from?: Element | null) {
  if (reducedMotion()) return;
  const scene = (from?.closest('[data-scene]') ?? document.querySelector('[data-scene]')) as HTMLElement | null;
  scene?.animate(
    [
      { transform: 'none' },
      { transform: 'translate(-6px, 2px)' },
      { transform: 'translate(6px, -2px)' },
      { transform: 'translate(-3px, 1px)' },
      { transform: 'none' },
    ],
    { duration: 400, easing: 'ease-in-out' },
  );
}

const STAR_SVG =
  '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z" fill="#E8A100" stroke="#1B1F3B" stroke-width="2" stroke-linejoin="round"/></svg>';

/**
 * A star flies from an element to a HUD counter (`data-hud-target`), 700 ms. Resolves when it lands,
 * so the screen can add the star to the counter at that moment and the counter pops.
 * With reduced motion it resolves at once and nothing flies.
 */
export function flyToHud(from: Element, target = 'stars'): Promise<void> {
  const to = document.querySelector(`[data-hud-target="${target}"]`);
  if (!to || reducedMotion()) return Promise.resolve();
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const el = document.createElement('div');
  el.innerHTML = STAR_SVG;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${a.left + a.width / 2 - 15}px`,
    top: `${a.top + a.height / 2 - 15}px`,
    zIndex: '60',
    pointerEvents: 'none',
  });
  document.body.append(el);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = el.animate(
    [
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 70}px) scale(1.5) rotate(90deg)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.7) rotate(200deg)` },
    ],
    { duration: 700, easing: 'cubic-bezier(.45,0,.55,1)' },
  );
  return anim.finished.then(
    () => el.remove(),
    () => el.remove(),
  );
}
