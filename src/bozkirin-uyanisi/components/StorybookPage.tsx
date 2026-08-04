import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { KenBurnsDirection } from '../../taidula-epic/segments';

interface StorybookPageProps {
  src: string;
  direction: KenBurnsDirection;
  durationInFrames: number;
  /** Altyazı için alt kenarda boş bırakılacak güvenli alan (yükseklik oranı).
   *  İllüstrasyon bu bandın üstüne yerleşir, böylece yazı hiçbir zaman
   *  karakterlerin yüzünü kapatmaz. */
  captionSafeRatio?: number;
}

/**
 * Resimli kitap sayfası gösterimi — "contain + bulanık zemin" yaklaşımı.
 *
 * NEDEN: İllüstrasyonlar 1.25 en-boy oranında, kompozisyon ise 16:9 (1.78).
 * objectFit:"cover" kullanılsa kare üstten/alttan agresif kırpılır ve
 * karakterlerin yüzleri/gövdeleri kadraj dışında kalırdı. Bunun yerine
 * illüstrasyon HER ZAMAN tam olarak (contain) gösteriliyor; 16:9'un yan
 * boşlukları aynı görselin bulanıklaştırılmış/karartılmış bir kopyasıyla
 * dolduruluyor. Böylece hiçbir karede yüz kesilmiyor.
 *
 * Ken Burns hareketi bilinçli olarak çok yumuşak (max %4 ölçek, %1.2 kaydırma)
 * — çocuk kitabı temposuna uygun "nefes alan" bir his veriyor ama kadrajı
 * bozup yüzleri kırpmıyor.
 */
const DRIFT_SCALE = 0.04;
const DRIFT_SHIFT = 1.2; // yüzde

export const StorybookPage: React.FC<StorybookPageProps> = ({
  src,
  direction,
  durationInFrames,
  captionSafeRatio = 0.2,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case 'zoom-in':
      scale = interpolate(progress, [0, 1], [1, 1 + DRIFT_SCALE]);
      break;
    case 'zoom-out':
      scale = interpolate(progress, [0, 1], [1 + DRIFT_SCALE, 1]);
      break;
    case 'pan-left':
      scale = 1 + DRIFT_SCALE / 2;
      translateX = interpolate(progress, [0, 1], [DRIFT_SHIFT, -DRIFT_SHIFT]);
      break;
    case 'pan-right':
      scale = 1 + DRIFT_SCALE / 2;
      translateX = interpolate(progress, [0, 1], [-DRIFT_SHIFT, DRIFT_SHIFT]);
      break;
    case 'pan-up':
      scale = 1 + DRIFT_SCALE / 2;
      translateY = interpolate(progress, [0, 1], [DRIFT_SHIFT, -DRIFT_SHIFT]);
      break;
    case 'pan-down':
      scale = 1 + DRIFT_SCALE / 2;
      translateY = interpolate(progress, [0, 1], [-DRIFT_SHIFT, DRIFT_SHIFT]);
      break;
  }

  const file = staticFile(src);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0a0a08' }}>
      {/* Yan boşlukları dolduran bulanık zemin */}
      <AbsoluteFill>
        <Img
          src={file}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(48px) brightness(0.45) saturate(1.1)',
            transform: 'scale(1.15)',
          }}
        />
      </AbsoluteFill>

      {/* İllüstrasyonun tamamı — hiçbir zaman kırpılmaz, altyazı bandının
          üstünde kalacak şekilde yerleşir */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          bottom: `${captionSafeRatio * 100}%`,
        }}
      >
        <Img
          src={file}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
