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

const zahl = (wert: number) => wert.toLocaleString('de-DE', { maximumFractionDigits: 1 });

/**
 * Obergrenzen für die Eingaben. Sie sollen Vertipper abfangen, keine echten
 * Aufträge: 40 m Raumseite und 1000 m² Fläche liegen weit über allem, was in
 * einer Wohnung oder einem Ladenlokal vorkommt. Wer wirklich mehr hat, ist mit
 * einem Richtwert ohnehin nicht bedient und ruft besser an – der Hinweis
 * darunter sagt das auch.
 */
const GRENZEN = {
  seite: 40,
  tueren: 12,
  raeume: 20,
  flaeche: 1000,
  leisten: 1500,
  fugen: 500,
} as const;

const num = (value: string, max = Number.POSITIVE_INFINITY) => {
  const parsed = Number.parseFloat(value.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.min(parsed, max);
};

/** Für die Anzeige: leert das Feld nicht, kürzt aber auf die Grenze ein. */
const begrenze = (value: string, max: number) => {
  const parsed = Number.parseFloat(value.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0) return value;
  return parsed > max ? String(max) : value;
};

const priceOf = (id: string) => prices.find((p) => p.id === id)?.from ?? 0;

/** Breite eines Türblatts – dort kommt keine Sockelleiste hin. */
const TUERBREITE = 0.9;

/** Üblicher Verschnitt beim Bodenkauf, wie in den häufigen Fragen genannt. */
const VERSCHNITT = 0.1;

type Raum = { id: number; name: string; laenge: string; breite: string; tueren: string };

const neuerRaum = (id: number, name: string): Raum => ({ id, name, laenge: '', breite: '', tueren: '1' });

/**
 * Richtwert-Rechner für die Arbeitsleistung.
 *
 * Zwei Wege hinein: entweder die Maße je Raum eintragen und übernehmen lassen,
 * oder die Mengen direkt eingeben. Beim Umfang werden die Türen abgezogen –
 * dort kommt keine Leiste hin, sonst fällt die Schätzung zu hoch aus.
 */
export default function PriceCalculator() {
  const [area, setArea] = useState('25');
  const [skirting, setSkirting] = useState('20');
  const [joints, setJoints] = useState('0');
  const [raeume, setRaeume] = useState<Raum[]>([neuerRaum(1, 'Raum 1')]);

  /* Was die eingetragenen Räume ergeben – wird erst auf Klick übernommen. */
  const ausRaeumen = useMemo(() => {
    let flaeche = 0;
    let umfang = 0;
    let vollstaendig = 0;

    for (const raum of raeume) {
      const l = num(raum.laenge, GRENZEN.seite);
      const b = num(raum.breite, GRENZEN.seite);
      if (!l || !b) continue;
      vollstaendig += 1;
      flaeche += l * b;
      umfang += Math.max(0, 2 * (l + b) - num(raum.tueren, GRENZEN.tueren) * TUERBREITE);
    }

    return {
      /* Auch die Summe aus vielen Räumen bleibt in dem Rahmen, den die Felder
         darunter annehmen. */
      flaeche: Math.min(GRENZEN.flaeche, Math.round(flaeche * 10) / 10),
      umfang: Math.min(GRENZEN.leisten, Math.round(umfang * 10) / 10),
      vollstaendig,
    };
  }, [raeume]);

  const values = useMemo(() => {
    const a = num(area, GRENZEN.flaeche);
    const s = num(skirting, GRENZEN.leisten);
    const j = num(joints, GRENZEN.fugen);

    const costArea = a * priceOf('verlegung');
    const costSkirting = s * priceOf('sockelleisten');
    const costJoints = j * priceOf('fugen');
    const summe = costArea + costSkirting + costJoints;

    /* Kleine Aufträge laufen nach Stunden, mit Mindestdauer. Der Richtwert
       darf deshalb nicht unter diesen Mindestbetrag rutschen. */
    const mindestbetrag = hourlyRate.amount * hourlyRate.minHours;
    const kleinauftrag = summe > 0 && summe < hourlyRate.thresholdOrderValue;
    const total = kleinauftrag ? Math.max(summe, mindestbetrag) : summe;

    return { a, s, j, costArea, costSkirting, costJoints, summe, total, kleinauftrag, mindestbetrag };
  }, [area, skirting, joints]);

  /* Steht eine Menge auf ihrer Obergrenze, ist ein Richtwert das falsche
     Werkzeug – dann lieber ein kurzer Anruf. */
  const amGrenzwert =
    values.a >= GRENZEN.flaeche || values.s >= GRENZEN.leisten || values.j >= GRENZEN.fugen;

  /* Wie viel Boden gekauft werden muss – Material stellt ja der Kunde. */
  const materialQm = values.a > 0 ? Math.ceil(values.a * (1 + VERSCHNITT)) : 0;

  const setzeRaum = (id: number, feld: keyof Omit<Raum, 'id' | 'name'>, wert: string) =>
    setRaeume((vorher) => vorher.map((raum) => (raum.id === id ? { ...raum, [feld]: wert } : raum)));

  const raumHinzufuegen = () =>
    setRaeume((vorher) => {
      if (vorher.length >= GRENZEN.raeume) return vorher;
      const id = Math.max(0, ...vorher.map((raum) => raum.id)) + 1;
      return [...vorher, neuerRaum(id, `Raum ${vorher.length + 1}`)];
    });

  const raumEntfernen = (id: number) =>
    setRaeume((vorher) => (vorher.length === 1 ? vorher : vorher.filter((raum) => raum.id !== id)));

  const uebernehmen = () => {
    if (!ausRaeumen.vollstaendig) return;
    setArea(String(ausRaeumen.flaeche));
    setSkirting(String(ausRaeumen.umfang));
  };

  const zuruecksetzen = () => {
    setArea('');
    setSkirting('');
    setJoints('');
    setRaeume([neuerRaum(1, 'Raum 1')]);
  };

  /* Die berechneten Werte gleich in die WhatsApp-Nachricht schreiben –
     so muss sie niemand abtippen. */
  const requestText = [
    'Hallo Herr Garrison, ich möchte ein Angebot anfragen.',
    '',
    values.a ? `Boden: ca. ${zahl(values.a)} m²` : null,
    values.s ? `Sockelleisten: ca. ${zahl(values.s)} lfm` : null,
    values.j ? `Fugen: ca. ${zahl(values.j)} lfm` : null,
    '',
    'Die Baustelle ist in:',
  ]
    .filter((zeile) => zeile !== null)
    .join('\n');

  return (
    <div className={styles.wrap}>
      <div className={styles.form}>
        {/* Maße je Raum – daraus entstehen Fläche und Umfang */}
        <div className={styles.rooms}>
          <div className={styles.roomsHead}>
            <span className={styles.label}>
              <Icon name="ruler" size={18} />
              Maße je Raum
            </span>
            <span className={styles.hint}>optional – geht auch direkt unten</span>
          </div>

          <ul className={styles.roomList}>
            {raeume.map((raum, index) => (
              <li key={raum.id} className={styles.roomRow}>
                <span className={styles.roomName}>{index + 1}</span>

                <div className={styles.roomField}>
                  <label htmlFor={`raum-${raum.id}-laenge`}>Länge (m)</label>
                  <input
                    id={`raum-${raum.id}-laenge`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max={GRENZEN.seite}
                    step="0.1"
                    placeholder="5"
                    value={raum.laenge}
                    onChange={(e) => setzeRaum(raum.id, 'laenge', e.target.value)}
                    onBlur={(e) => setzeRaum(raum.id, 'laenge', begrenze(e.target.value, GRENZEN.seite))}
                  />
                </div>

                <div className={styles.roomField}>
                  <label htmlFor={`raum-${raum.id}-breite`}>Breite (m)</label>
                  <input
                    id={`raum-${raum.id}-breite`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max={GRENZEN.seite}
                    step="0.1"
                    placeholder="4"
                    value={raum.breite}
                    onChange={(e) => setzeRaum(raum.id, 'breite', e.target.value)}
                    onBlur={(e) => setzeRaum(raum.id, 'breite', begrenze(e.target.value, GRENZEN.seite))}
                  />
                </div>

                <div className={styles.roomField}>
                  <label htmlFor={`raum-${raum.id}-tueren`}>Türen</label>
                  <input
                    id={`raum-${raum.id}-tueren`}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max={GRENZEN.tueren}
                    step="1"
                    value={raum.tueren}
                    onChange={(e) => setzeRaum(raum.id, 'tueren', e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className={styles.roomRemove}
                  onClick={() => raumEntfernen(raum.id)}
                  disabled={raeume.length === 1}
                  title="Raum entfernen"
                >
                  <Icon name="close" size={15} />
                  <span className="visually-hidden">Raum {index + 1} entfernen</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.roomsFoot}>
            <button
              type="button"
              className={styles.roomAdd}
              onClick={raumHinzufuegen}
              disabled={raeume.length >= GRENZEN.raeume}
            >
              <Icon name="plus" size={15} />
              Raum hinzufügen
            </button>

            <span className={styles.roomsSum}>
              {ausRaeumen.vollstaendig > 0
                ? `${zahl(ausRaeumen.flaeche)} m² · ${zahl(ausRaeumen.umfang)} lfm`
                : 'noch keine Maße'}
            </span>

            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={uebernehmen}
              disabled={!ausRaeumen.vollstaendig}
            >
              Übernehmen
              <Icon name="arrow-right" size={15} />
            </button>
          </div>

          <p className={styles.roomsNote}>
            Der Umfang zieht je Tür {zahl(TUERBREITE)} m ab – dort kommt keine Leiste hin.
            {raeume.length >= GRENZEN.raeume && ` Mehr als ${GRENZEN.raeume} Räume nehme ich hier nicht auf – bei dem Umfang rechnen wir das besser gemeinsam durch.`}
          </p>
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
              max={GRENZEN.flaeche}
              step="0.5"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onBlur={(e) => setArea(begrenze(e.target.value, GRENZEN.flaeche))}
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
              max={GRENZEN.leisten}
              step="0.5"
              value={skirting}
              onChange={(e) => setSkirting(e.target.value)}
              onBlur={(e) => setSkirting(begrenze(e.target.value, GRENZEN.leisten))}
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
              max={GRENZEN.fugen}
              step="0.5"
              value={joints}
              onChange={(e) => setJoints(e.target.value)}
              onBlur={(e) => setJoints(begrenze(e.target.value, GRENZEN.fugen))}
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

        {amGrenzwert && (
          <p className={styles.roomsNote}>
            Der Rechner deckt bis {zahl(GRENZEN.flaeche)} m², {zahl(GRENZEN.leisten)} lfm Leisten und{' '}
            {zahl(GRENZEN.fugen)} lfm Fugen ab. Darüber ist ein Richtwert zu grob – rufen Sie mich
            kurz an, dann rechne ich das konkret.
          </p>
        )}
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
              <span>Verlegung · {zahl(values.a)} m²</span>
              <strong>{euro.format(values.costArea)}</strong>
            </li>
          )}
          {values.s > 0 && (
            <li className={styles.breakdownRow}>
              <span>Sockelleisten · {zahl(values.s)} lfm</span>
              <strong>{euro.format(values.costSkirting)}</strong>
            </li>
          )}
          {values.j > 0 && (
            <li className={styles.breakdownRow}>
              <span>Fugen · {zahl(values.j)} lfm</span>
              <strong>{euro.format(values.costJoints)}</strong>
            </li>
          )}
          {values.kleinauftrag && values.total > values.summe && (
            <li className={styles.breakdownRow} data-hinweis="">
              <span>Mindestbetrag kleiner Auftrag</span>
              <strong>{euro.format(values.total)}</strong>
            </li>
          )}
          {values.total === 0 && (
            <li className={styles.breakdownRow}>
              <span>Bitte tragen Sie Ihre Maße ein.</span>
            </li>
          )}
        </ul>

        {materialQm > 0 && (
          <p className={styles.notice} data-ton="ruhig">
            <Icon name="plank" size={16} />
            Zu kaufen sind rund {materialQm} m² Boden – {Math.round(VERSCHNITT * 100)} Prozent Verschnitt sind darin
            enthalten.
          </p>
        )}

        {values.kleinauftrag && (
          <p className={styles.notice}>
            <Icon name="info" size={16} />
            Unter {hourlyRate.thresholdOrderValue} € rechne ich nach Stunden ab: ab {hourlyRate.amount} €/Std.,
            mindestens {zahl(hourlyRate.minHours)} Stunden – also ab {euro.format(values.mindestbetrag)}.
          </p>
        )}

        <a href={whatsappLink(requestText)} className="btn btn--accent btn--block" target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={18} />
          Mit diesen Werten anfragen
        </a>

        <button type="button" className={styles.reset} onClick={zuruecksetzen}>
          Alles zurücksetzen
        </button>

        <p className={styles.disclaimer}>
          Unverbindlicher Richtwert für die Arbeitsleistung. Material stellt der Kunde. Der verbindliche Preis steht im
          schriftlichen Angebot nach der Besichtigung.
        </p>
      </aside>
    </div>
  );
}
