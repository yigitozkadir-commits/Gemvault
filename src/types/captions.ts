export interface CaptionWord {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface CaptionCue {
  text: string;
  startFrame: number;
  endFrame: number;
  /** Gerçek ElevenLabs kelime-bazlı zaman kodları. Yoksa AnimatedCaptions
   * karakter uzunluğuna orantılı bir fallback üretir. */
  words?: CaptionWord[];
}
