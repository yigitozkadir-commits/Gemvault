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
import { UkokPrensesiFilm } from "./scenes/UkokPrensesi";
import { LoulanGuzeliFilm } from "./scenes/LoulanGuzeli";
import { LoulanGuzeliV2Film } from "./scenes/LoulanGuzeliV2";
import {
  TaidulaEpicFilm,
  TAIDULA_EPIC_DURATION_FRAMES,
  TAIDULA_EPIC_FPS,
  TAIDULA_EPIC_WIDTH,
  TAIDULA_EPIC_HEIGHT,
} from "./taidula-epic/TaidulaEpicFilm";
import {
  BozkirinUyanisiFilm,
  BOZKIRIN_UYANISI_DURATION_FRAMES,
  BOZKIRIN_UYANISI_FPS,
  BOZKIRIN_UYANISI_WIDTH,
  BOZKIRIN_UYANISI_HEIGHT,
} from "./bozkirin-uyanisi/BozkirinUyanisiFilm";
import {
  BozkirinUyanisiFilmV2,
  BOZKIRIN_UYANISI_V2_DURATION_FRAMES,
  BOZKIRIN_UYANISI_V2_FPS,
  BOZKIRIN_UYANISI_V2_WIDTH,
  BOZKIRIN_UYANISI_V2_HEIGHT,
} from "./bozkirin-uyanisi/BozkirinUyanisiFilmV2";
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
  UKOK_PRENSESI_VIDEO_CONFIG,
  UKOK_PRENSESI_DURATION_FRAMES,
  LOULAN_GUZELI_VIDEO_CONFIG,
  LOULAN_GUZELI_DURATION_FRAMES,
  LOULAN_GUZELI_V2_VIDEO_CONFIG,
  LOULAN_GUZELI_V2_DURATION_FRAMES,
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
const UkokPrensesiWithOutro: React.FC = () => (
  <FilmWithOutro film={<UkokPrensesiFilm />} filmFrames={UKOK_PRENSESI_DURATION_FRAMES} />
);
const LoulanGuzeliWithOutro: React.FC = () => (
  <FilmWithOutro film={<LoulanGuzeliFilm />} filmFrames={LOULAN_GUZELI_DURATION_FRAMES} />
);
const LoulanGuzeliV2WithOutro: React.FC = () => (
  <FilmWithOutro film={<LoulanGuzeliV2Film />} filmFrames={LOULAN_GUZELI_V2_DURATION_FRAMES} />
);
const TaidulaEpicWithOutro: React.FC = () => (
  <FilmWithOutro film={<TaidulaEpicFilm />} filmFrames={TAIDULA_EPIC_DURATION_FRAMES} />
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
      <Composition
        id="UkokPrensesi"
        component={UkokPrensesiWithOutro}
        durationInFrames={UKOK_PRENSESI_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={UKOK_PRENSESI_VIDEO_CONFIG.fps}
        width={UKOK_PRENSESI_VIDEO_CONFIG.width}
        height={UKOK_PRENSESI_VIDEO_CONFIG.height}
      />
      <Composition
        id="LoulanGuzeli"
        component={LoulanGuzeliWithOutro}
        durationInFrames={LOULAN_GUZELI_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={LOULAN_GUZELI_VIDEO_CONFIG.fps}
        width={LOULAN_GUZELI_VIDEO_CONFIG.width}
        height={LOULAN_GUZELI_VIDEO_CONFIG.height}
      />
      <Composition
        id="LoulanGuzeliV2"
        component={LoulanGuzeliV2WithOutro}
        durationInFrames={LOULAN_GUZELI_V2_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={LOULAN_GUZELI_V2_VIDEO_CONFIG.fps}
        width={LOULAN_GUZELI_V2_VIDEO_CONFIG.width}
        height={LOULAN_GUZELI_V2_VIDEO_CONFIG.height}
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

      {/* "TAIDULA — Buz Altında Bir Hükümdar" — uzun format (16:9, ~8:28)
          belgesel denemesi. Seriden ayrı bir yapı (24 segmentlik crossfade
          montaj), sonuna diğer seri filmleriyle aynı GÖKUMAY kapanış
          imzası eklendi. */}
      <Composition
        id="TaidulaEpic"
        component={TaidulaEpicWithOutro}
        durationInFrames={TAIDULA_EPIC_DURATION_FRAMES + SERIES_OUTRO_FRAMES}
        fps={TAIDULA_EPIC_FPS}
        width={TAIDULA_EPIC_WIDTH}
        height={TAIDULA_EPIC_HEIGHT}
      />

      {/* "Bozkırın Uyanışı — Umay ve Kağan'ın Destanı" — Gök Umay Çocuk
          Kitapları serisinin ilk resimli kitap videosu. Şu an sadece PDF
          sayfaları + tam seslendirme; AI video eklentileri ve müzik/SFX
          sonraki adımda eklenecek. */}
      <Composition
        id="BozkirinUyanisi"
        component={BozkirinUyanisiFilm}
        durationInFrames={BOZKIRIN_UYANISI_DURATION_FRAMES}
        fps={BOZKIRIN_UYANISI_FPS}
        width={BOZKIRIN_UYANISI_WIDTH}
        height={BOZKIRIN_UYANISI_HEIGHT}
      />

      {/* "Bozkırın Uyanışı" v2 — 12 yeni statik görsel + 3 Google Flow AI
          videosu + yeni kapanış videosuyla genişletilmiş tam kurgu. */}
      <Composition
        id="BozkirinUyanisiV2"
        component={BozkirinUyanisiFilmV2}
        durationInFrames={BOZKIRIN_UYANISI_V2_DURATION_FRAMES}
        fps={BOZKIRIN_UYANISI_V2_FPS}
        width={BOZKIRIN_UYANISI_V2_WIDTH}
        height={BOZKIRIN_UYANISI_V2_HEIGHT}
      />
    </>
  );
};
