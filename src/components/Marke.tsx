import { asset } from '@/lib/assets';

/**
 * Das Zeichen der Marke: ein Fischgrätsiegel.
 *
 * Als <img> aus public/marke.svg, nicht als Inline-SVG – so bleibt die Datei
 * die einzige Quelle. Ändert der Betreiber sein Logo, tauscht er die Datei und
 * nichts sonst.
 *
 * Das Gold steckt in der Datei selbst (#c3a063) und wird hier nicht
 * überschrieben, damit Website und Logo dieselbe Farbe zeigen.
 */
export default function Marke({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <img
      src={asset('/marke.svg')}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      draggable={false}
    />
  );
}
