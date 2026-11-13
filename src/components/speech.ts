// Read to me (L2): the browser's own speech, nothing sent anywhere. One voice speaks at a time; leaving a screen
// stops it. If the device has no voice for the player's language, the button is hidden.
import { useEffect, useState } from 'react';
import { useI18n, type Language } from '../content/i18n';

const supported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

// Prefer friendly female / youthful voices for Twinkle over deep male voices
const FEMALE_VOICE_REGEX = /zira|jenny|aria|samantha|victoria|karen|cynthia|ana|female|girl|child/i;
const MALE_VOICE_REGEX = /david|mark|george|male|guy/i;

/** The voice to use for a language, or undefined when the device has none. */
export function pickVoice<V extends { lang: string; default?: boolean; name?: string }>(voices: V[], lang: Language): V | undefined {
  const mine = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(lang));
  if (!mine.length) return undefined;

  // 1. First priority: female / youthful voice for Twinkle's cute character
  const femaleVoice = mine.find((v) => v.name && FEMALE_VOICE_REGEX.test(v.name));
  if (femaleVoice) return femaleVoice;

  // 2. Second priority: any non-explicitly male voice, preferring the default
  const nonMale = mine.filter((v) => !v.name || !MALE_VOICE_REGEX.test(v.name));
  if (nonMale.length) {
    return nonMale.find((v) => v.default) ?? nonMale[0];
  }

  // 3. Fallback: default or first matching voice
  return mine.find((v) => v.default) ?? mine[0];
}

/** True when the device can speak the current language. Voices load late on some browsers, so it listens. */
export function useCanSpeak(): boolean {
  const lang = useI18n((s) => s.lang);
  const [can, setCan] = useState(false);
  useEffect(() => {
    if (!supported()) {
      setCan(false);
      return;
    }
    const check = () => setCan(!!pickVoice(window.speechSynthesis.getVoices(), lang));
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, [lang]);
  return can;
}

export function stopSpeaking() {
  if (supported()) window.speechSynthesis.cancel();
}

/** Speak `text`; calls `onEnd` when it finishes or is stopped. Returns false when nothing can speak. */
export function speak(text: string, lang: Language, onEnd: () => void): boolean {
  if (!supported()) return false;
  const voice = pickVoice(window.speechSynthesis.getVoices(), lang);
  if (!voice) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.pitch = 1.35; // Cute, youthful, bright, friendly little girl robot pitch for Twinkle
  u.rate = 1.05;  // Lively, enthusiastic pacing
  u.volume = 1.0; // full loud volume
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
  return true;
}
