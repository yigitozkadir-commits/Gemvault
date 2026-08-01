import React from "react";
import { Sequence } from "remotion";
import { SeriesOutro, SERIES_OUTRO_FRAMES } from "./SeriesOutro";

/**
 * Bir filmi, sonuna seri kapanış imzası (GÖKUMAY amblemi) eklenmiş haliyle
 * sarmalar. Composition'ın durationInFrames'i filmFrames + SERIES_OUTRO_FRAMES
 * olmalı.
 */
export const FilmWithOutro: React.FC<{
  film: React.ReactNode;
  filmFrames: number;
}> = ({ film, filmFrames }) => (
  <>
    <Sequence from={0} durationInFrames={filmFrames}>
      {film}
    </Sequence>
    <Sequence from={filmFrames} durationInFrames={SERIES_OUTRO_FRAMES}>
      <SeriesOutro />
    </Sequence>
  </>
);

export { SERIES_OUTRO_FRAMES };
