import React from "react";
import { Composition } from "remotion";
import { GemVaultAd1 } from "./scenes/GemVaultAd1";
import { GemVaultAd2 } from "./scenes/GemVaultAd2";
import {
  ChingHatunFilm,
  ChingHatunFilmVertical,
  ChingHatunFilmV2,
  ChingHatunFilmV2Vertical,
} from "./scenes/ChingHatun";
import { TaidulaFilm } from "./scenes/Taidula";
import { TerkenHatunFilm } from "./scenes/TerkenHatun";
import { SuyumbikeHatunFilm } from "./scenes/SuyumbikeHatun";
import { SubeshiCadilariFilm } from "./scenes/SubeshiCadilari";
import { OrumcekAdamFilm } from "./scenes/OrumcekAdam";
import { FilmWithOutro } from "./components/FilmWithOutro";
import { SERIES_OUTRO_FRAMES } from "./components/SeriesOutro";
import {
  VIDEO_CONFIG,
  SCENE_DURATION_FRAMES,
  CING_HATUN_VIDEO_CONFIG,
  CING_HATUN_DURATION_FRAMES,
  CING_HATUN_VERTICAL_VIDEO_CONFIG,
  TAIDULA_VIDEO_CONFIG,
  TAIDULA_DURATION_FRAMES,
  TERKEN_HATUN_VIDEO_CONFIG,
  TERKEN_HATUN_DURATION_FRAMES,
  SUYUMBIKE_HATUN_VIDEO_CONFIG,
  SUYUMBIKE_HATUN_DURATION_FRAMES,
  SUBESHI_CADILARI_VIDEO_CONFIG,
  SUBESHI_CADILARI_DURATION_FRAMES,
  ORUMCEK_ADAM_VIDEO_CONFIG,
  ORUMCEK_ADAM_DURATION_FRAMES,
} from "./theme";

// Her seri filminin sonuna GÖKUMAY kapanış imzası eklenir.
const ChingHatunWithOutro: React.FC = () => (
  <FilmWithOutro film={<ChingHatunFilm />} filmFrames={CING_HATUN_DURATION_FRAMES} />
);
const ChingHatunVerticalWithOutro: React.FC = () => (
  <FilmWithOutro film={<ChingHatunFilmVertical />} filmFrames={CING_HATUN_DURATION_FRAMES} />
);
const ChingHatunV2WithOutro: React.FC = () => (
  <FilmWithOutro film={<ChingHatunFilmV2 />} filmFrames={CING_HATUN_DURATION_FRAMES} />
);
const ChingHatunV2VerticalWithOutro: React.FC = () => (
  <FilmWithOutro film={<ChingHatunFilmV2Vertical />} filmFrames={CING_HATUN_DURATION_FRAMES} />
);
const TaidulaWithOutro: React.FC = () => (
  <FilmWithOutro film={<TaidulaFilm />} filmFrames={TAIDULA_DURATION_FRAMES} />
);
const TerkenHatunWithOutro: React.FC = () => (
  <FilmWithOutro film={<TerkenHatunFilm />} filmFrames={TERKEN_HATUN_DURATION_FRAMES} />
);
const SuyumbikeHatunWithOutro: React.FC = () => (
  <FilmWithOutro film={<SuyumbikeHatunFilm />} filmFrames={SUYUMBIKE_HATUN_DURATION_FRAMES} />
);
const SubeshiCadilariWithOutro: React.FC = () => (
  <FilmWithOutro film={<SubeshiCadilariFilm />} filmFrames={SUBESHI_CADILARI_DURATION_FRAMES} />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GemVaultAd1"
        component={GemVaultAd1}
        durationInFrames={9 * SCENE_DURATION_FRAMES} // 90sn
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="GemVaultAd2"
        component={GemVaultAd2}
        durationInFrames={7 * SCENE_DURATION_FRAMES} // 70sn
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="ChingHatun"
        component={ChingHatunWithOutro}
        durationInFrames={CING_HATUN_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={CING_HATUN_VIDEO_CONFIG.fps}
        width={CING_HATUN_VIDEO_CONFIG.width}
        height={CING_HATUN_VIDEO_CONFIG.height}
      />
      <Composition
        id="ChingHatunVertical"
        component={ChingHatunVerticalWithOutro}
        durationInFrames={CING_HATUN_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={CING_HATUN_VERTICAL_VIDEO_CONFIG.fps}
        width={CING_HATUN_VERTICAL_VIDEO_CONFIG.width}
        height={CING_HATUN_VERTICAL_VIDEO_CONFIG.height}
      />
      <Composition
        id="ChingHatunV2"
        component={ChingHatunV2WithOutro}
        durationInFrames={CING_HATUN_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={CING_HATUN_VIDEO_CONFIG.fps}
        width={CING_HATUN_VIDEO_CONFIG.width}
        height={CING_HATUN_VIDEO_CONFIG.height}
      />
      <Composition
        id="ChingHatunV2Vertical"
        component={ChingHatunV2VerticalWithOutro}
        durationInFrames={CING_HATUN_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={CING_HATUN_VERTICAL_VIDEO_CONFIG.fps}
        width={CING_HATUN_VERTICAL_VIDEO_CONFIG.width}
        height={CING_HATUN_VERTICAL_VIDEO_CONFIG.height}
      />
      <Composition
        id="Taidula"
        component={TaidulaWithOutro}
        durationInFrames={TAIDULA_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={TAIDULA_VIDEO_CONFIG.fps}
        width={TAIDULA_VIDEO_CONFIG.width}
        height={TAIDULA_VIDEO_CONFIG.height}
      />
      <Composition
        id="TerkenHatun"
        component={TerkenHatunWithOutro}
        durationInFrames={TERKEN_HATUN_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={TERKEN_HATUN_VIDEO_CONFIG.fps}
        width={TERKEN_HATUN_VIDEO_CONFIG.width}
        height={TERKEN_HATUN_VIDEO_CONFIG.height}
      />
      <Composition
        id="SuyumbikeHatun"
        component={SuyumbikeHatunWithOutro}
        durationInFrames={SUYUMBIKE_HATUN_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={SUYUMBIKE_HATUN_VIDEO_CONFIG.fps}
        width={SUYUMBIKE_HATUN_VIDEO_CONFIG.width}
        height={SUYUMBIKE_HATUN_VIDEO_CONFIG.height}
      />
      <Composition
        id="SubeshiCadilari"
        component={SubeshiCadilariWithOutro}
        durationInFrames={SUBESHI_CADILARI_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={SUBESHI_CADILARI_VIDEO_CONFIG.fps}
        width={SUBESHI_CADILARI_VIDEO_CONFIG.width}
        height={SUBESHI_CADILARI_VIDEO_CONFIG.height}
      />

      {/* Bozkır Hatunları serisinden bağımsız hobi projesi — kapanış imzası yok. */}
      <Composition
        id="OrumcekAdam"
        component={OrumcekAdamFilm}
        durationInFrames={ORUMCEK_ADAM_DURATION_FRAMES}
        fps={ORUMCEK_ADAM_VIDEO_CONFIG.fps}
        width={ORUMCEK_ADAM_VIDEO_CONFIG.width}
        height={ORUMCEK_ADAM_VIDEO_CONFIG.height}
      />
    </>
  );
};
