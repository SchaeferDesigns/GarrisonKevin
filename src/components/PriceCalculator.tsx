'use client';

import { useMemo, useState } from 'react';
import Icon from './Icon';
import { hourlyRate, prices, whatsappLink } from '@/lib/business';
import styles from './PriceCalculator.module.css';

const euro = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const num = (value: string) => {
  const parsed = Number.parseFloat(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const priceOf = (id: string) => prices.find((p) => p.id === id)?.from ?? 0;

/**
 * Richtwert-Rechner für die Arbeitsleistung.
 * Rechnet ausschließlich im Browser – es werden keine Eingaben übertragen oder gespeichert.
 */
export default function PriceCalculator() {
  const [area, setArea] = useState('25');
  const [skirting, setSkirting] = useState('20');
  const [joints, setJoints] = useState('0');
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');

  const values = useMemo(() => {
    const a = num(area);
    const s = num(skirting);
    const j = num(joints);

    const costArea = a * priceOf('verlegung');
    const costSkirting = s * priceOf('sockelleisten');
    const costJoints = j * priceOf('fugen');
    const total = costArea + costSkirting + costJoints;

    return { a, s, j, costArea, costSkirting, costJoints, total };
  }, [area, skirting, joints]);

  const isSmallOrder = values.total > 0 && values.total < hourlyRate.thresholdOrderValue;

  const applyRoom = () => {
    const l = num(roomLength);
    const w = num(roomWidth);
    if (!l || !w) return;
    setArea(String(Math.round(l * w * 10) / 10));
    setSkirting(String(Math.round((l + w) * 2 * 10) / 10));
  };

  /* Die berechneten Werte gleich in die WhatsApp-Nachricht schreiben –
     so muss sie niemand abtippen. */
  const requestText = [
    'Hallo Herr Garrison, ich möchte ein Angebot anfragen.',
    '',
    values.a ? `Boden: ca. ${values.a} m²` : null,
    values.s ? `Sockelleisten: ca. ${values.s} lfm` : null,
    values.j ? `Fugen: ca. ${values.j} lfm` : null,
    '',
    'Die Baustelle ist in:',
  ]
    .filter((zeile) => zeile !== null)
    .join('\n');

  return (
    <div className={styles.wrap}>
      <div className={styles.form}>
        {/* Hilfe: aus Raummaßen Fläche und Umfang berechnen */}
        <div className={styles.roomHelper}>
          <div className={styles.roomField}>
            <label htmlFor="raum-laenge">Raumlänge (m)</label>
            <input
              id="raum-laenge"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              placeholder="z. B. 5"
              value={roomLength}
              onChange={(e) => setRoomLength(e.target.value)}
            />
          </div>
          <div className={styles.roomField}>
            <label htmlFor="raum-breite">Raumbreite (m)</label>
            <input
              id="raum-breite"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              placeholder="z. B. 4"
              value={roomWidth}
              onChange={(e) => setRoomWidth(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={applyRoom}>
            <Icon name="ruler" size={16} />
            Fläche übernehmen
          </button>
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <span className={styles.label}>
              <Icon name="plank" size={18} />
              <label htmlFor="calc-flaeche">Bodenfläche</label>
            </span>
            <span className={styles.hint}>ab {priceOf('verlegung')} € pro m²</span>
          </div>
          <div className={styles.inputRow}>
            <input
              id="calc-flaeche"
              className={styles.input}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <span className={styles.unit}>m²</span>
          </div>
          <input
            className={styles.range}
            type="range"
            min="0"
            max="200"
            step="1"
            value={Math.min(values.a, 200)}
            onChange={(e) => setArea(e.target.value)}
            aria-label="Bodenfläche per Schieberegler wählen"
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <span className={styles.label}>
              <Icon name="skirting" size={18} />
              <label htmlFor="calc-leisten">Sockelleisten</label>
            </span>
            <span className={styles.hint}>ab {priceOf('sockelleisten')} € pro lfm</span>
          </div>
          <div className={styles.inputRow}>
            <input
              id="calc-leisten"
              className={styles.input}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={skirting}
              onChange={(e) => setSkirting(e.target.value)}
            />
            <span className={styles.unit}>lfm</span>
          </div>
          <input
            className={styles.range}
            type="range"
            min="0"
            max="150"
            step="1"
            value={Math.min(values.s, 150)}
            onChange={(e) => setSkirting(e.target.value)}
            aria-label="Sockelleisten per Schieberegler wählen"
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <span className={styles.label}>
              <Icon name="joint" size={18} />
              <label htmlFor="calc-fugen">Acryl- &amp; Silikonfugen</label>
            </span>
            <span className={styles.hint}>ab {priceOf('fugen')} € pro lfm</span>
          </div>
          <div className={styles.inputRow}>
            <input
              id="calc-fugen"
              className={styles.input}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={joints}
              onChange={(e) => setJoints(e.target.value)}
            />
            <span className={styles.unit}>lfm</span>
          </div>
          <input
            className={styles.range}
            type="range"
            min="0"
            max="80"
            step="1"
            value={Math.min(values.j, 80)}
            onChange={(e) => setJoints(e.target.value)}
            aria-label="Fugenlänge per Schieberegler wählen"
          />
        </div>
      </div>

      <aside className={styles.result} aria-live="polite">
        <span className={styles.resultTitle}>Richtwert Arbeitsleistung</span>
        <span className={styles.total}>
          {values.total > 0 ? `ab ${euro.format(values.total)}` : '—'}
          {values.total > 0 && <small>zzgl. Material</small>}
        </span>

        <ul className={styles.breakdown}>
          {values.a > 0 && (
            <li className={styles.breakdownRow}>
              <span>
                Verlegung · {values.a.toLocaleString('de-DE')} m²
              </span>
              <strong>{euro.format(values.costArea)}</strong>
            </li>
          )}
          {values.s > 0 && (
            <li className={styles.breakdownRow}>
              <span>Sockelleisten · {values.s.toLocaleString('de-DE')} lfm</span>
              <strong>{euro.format(values.costSkirting)}</strong>
            </li>
          )}
          {values.j > 0 && (
            <li className={styles.breakdownRow}>
              <span>Fugen · {values.j.toLocaleString('de-DE')} lfm</span>
              <strong>{euro.format(values.costJoints)}</strong>
            </li>
          )}
          {values.total === 0 && (
            <li className={styles.breakdownRow}>
              <span>Bitte tragen Sie oben Ihre Maße ein.</span>
            </li>
          )}
        </ul>

        {isSmallOrder && (
          <p className={styles.notice}>
            <Icon name="info" size={16} />
            Unter {hourlyRate.thresholdOrderValue} € rechne ich nach Stunden ab: ab {hourlyRate.amount} €/Std., mindestens{' '}
            {hourlyRate.minHours.toLocaleString('de-DE')} Stunden.
          </p>
        )}

        <a
          href={whatsappLink(requestText)}
          className="btn btn--accent btn--block"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="whatsapp" size={18} />
          Mit diesen Werten anfragen
        </a>

        <p className={styles.disclaimer}>
          Unverbindlicher Richtwert für die Arbeitsleistung. Material stellt der Kunde. Der verbindliche Preis steht im
          schriftlichen Angebot nach der Besichtigung. Die Berechnung findet nur in Ihrem Browser statt – es werden
          keine Daten übertragen.
        </p>
      </aside>
    </div>
  );
}
