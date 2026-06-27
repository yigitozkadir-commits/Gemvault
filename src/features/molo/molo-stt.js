const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

export function initSTT(onResult, onError) {
  if (!SpeechRecognition) return false;

  recognition = new SpeechRecognition();
  recognition.lang = 'tr-TR';
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) onResult(transcript.trim());
    isListening = false;
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
    isListening = false;
  };

  recognition.onend = () => {
    isListening = false;
  };

  return true;
}

export function startListening() {
  if (!recognition || isListening) return;
  isListening = true;
  recognition.start();
}

export function stopListening() {
  if (!recognition) return;
  recognition.stop();
  isListening = false;
}

export function getIsListening() {
  return isListening;
}
