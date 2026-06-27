/* global speechSynthesis */

let currentUtterance = null;
let ttsEnabled = false;

export function initTTS() {
  if (!('speechSynthesis' in window)) return false;
  ttsEnabled = true;
  return true;
}

export function speak(text) {
  if (!ttsEnabled || !('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  if (speechSynthesis) speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'tr-TR';
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (speechSynthesis) speechSynthesis.speak(utterance);
  currentUtterance = utterance;
}

export function stopTTS() {
  if ('speechSynthesis' in window && speechSynthesis) {
    speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  if (!ttsEnabled) stopTTS();
  return ttsEnabled;
}

export function getTTSEnabled() {
  return ttsEnabled;
}
