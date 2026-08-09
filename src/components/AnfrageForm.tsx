'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Icon, { type IconName } from './Icon';
import { business, mailtoLink, whatsappLink } from '@/lib/business';
import {
  buildMessage,
  contactPreferences,
  customerTypes,
  emptyAnfrage,
  hasFormEndpoint,
  materialOptions,
  oldFloorOptions,
  sendAnfrage,
  timeframes,
  type AnfrageData,
} from '@/lib/anfrage';
import styles from './AnfrageForm.module.css';

const workTypes: { id: string; label: string; hint: string; icon: IconName }[] = [
  {
    id: 'Bodenverlegung (Laminat, Vinyl, Klickboden)',
    label: 'Bodenverlegung',
    hint: 'Laminat, Vinyl, Klickboden',
    icon: 'plank',
  },
  { id: 'Sockelleisten montieren', label: 'Sockelleisten', hint: 'Zuschnitt und Montage', icon: 'skirting' },
  { id: 'Acryl- & Silikonfugen', label: 'Fugen erneuern', hint: 'Acryl und Silikon', icon: 'joint' },
  { id: 'Ausbesserung / Teilfläche', label: 'Ausbesserung', hint: 'auch an fremd verlegten Böden', icon: 'ruler' },
  { id: 'Material gemeinsam aussuchen', label: 'Materialberatung', hint: 'Auswahl und Anlieferung', icon: 'handshake' },
];

type Step = {
  id: string;
  label: string;
  heading: string;
  hint: string;
  icon: IconName;
};

const steps: Step[] = [
  {
    id: 'leistung',
    label: 'Leistung',
    heading: 'Worum geht es?',
    hint: 'Mehrfachauswahl möglich. Später lässt sich alles noch ändern.',
    icon: 'ruler',
  },
  {
    id: 'umfang',
    label: 'Umfang',
    heading: 'Wie groß ist der Umfang?',
    hint: 'Geschätzte Werte genügen. Gemessen wird bei der Besichtigung.',
    icon: 'calculator',
  },
  {
    id: 'objekt',
    label: 'Ort & Termin',
    heading: 'Wo und wann?',
    hint: 'Der Ort entscheidet, ob die Baustelle im Einsatzgebiet liegt.',
    icon: 'calendar',
  },
  {
    id: 'kontakt',
    label: 'Kontakt',
    heading: 'Wie erreiche ich Sie?',
    hint: 'Eine Rückmeldung kommt in der Regel innerhalb von 24 Stunden.',
    icon: 'user',
  },
  {
    id: 'senden',
    label: 'Prüfen',
    heading: 'Angaben prüfen und absenden',
    hint: 'Bitte kurz kontrollieren – danach geht die Anfrage raus.',
    icon: 'document',
  },
];

const lastStep = steps.length - 1;

type FieldErrors = Partial<Record<keyof AnfrageData, string>>;

/** Prüfregeln je Schritt. Leeres Objekt bedeutet: Schritt ist in Ordnung. */
function validateStep(step: number, data: AnfrageData): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0 && data.services.length === 0) {
    errors.services = 'Bitte wählen Sie mindestens eine Leistung aus.';
  }

  if (step === 1) {
    const numeric: (keyof AnfrageData)[] = ['area', 'skirting', 'joints'];
    for (const key of numeric) {
      const value = String(data[key]).trim();
      if (value && !(Number(value.replace(',', '.')) > 0)) {
        errors[key] = 'Bitte eine Zahl größer als 0 eintragen oder das Feld leer lassen.';
      }
    }
  }

  if (step === 2 && !data.place.trim()) {
    errors.place = 'Bitte geben Sie Ort oder Postleitzahl der Baustelle an.';
  }

  if (step === 3) {
    if (!data.name.trim()) {
      errors.name = 'Bitte tragen Sie Ihren Namen ein.';
    }
    if (!data.phone.trim() && !data.email.trim()) {
      errors.phone = 'Bitte hinterlassen Sie Telefonnummer oder E-Mail-Adresse für die Rückmeldung.';
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
      errors.email = 'Diese E-Mail-Adresse sieht nicht vollständig aus.';
    }
    if (data.contactPreference === 'E-Mail' && !data.email.trim()) {
      errors.email = 'Für eine Rückmeldung per E-Mail wird die Adresse benötigt.';
    }
    if (data.contactPreference !== 'E-Mail' && !data.phone.trim()) {
      errors.phone = `Für eine Rückmeldung per ${data.contactPreference} wird die Telefonnummer benötigt.`;
    }
  }

  if (step === lastStep && hasFormEndpoint && !data.consent) {
    errors.consent = 'Ohne Ihre Einwilligung kann die Anfrage nicht übermittelt werden.';
  }

  return errors;
}

type Status = 'idle' | 'sending' | 'success' | 'handoff' | 'error';

/**
 * Mehrstufiges Anfrageformular.
 *
 * Der Versand läuft über `sendAnfrage` an den in NEXT_PUBLIC_FORM_ENDPOINT
 * hinterlegten Endpunkt. Solange kein Endpunkt konfiguriert ist, übergibt der
 * letzte Schritt die fertige Nachricht an das E-Mail-Programm oder an WhatsApp,
 * damit jeder Button auch ohne Anbindung eine echte Funktion hat.
 */
export default function AnfrageForm() {
  const params = useSearchParams();

  const [data, setData] = useState<AnfrageData>(() => {
    /* Eigene Liste, damit der Vorbelegungs-Push nicht das Modul-Objekt verändert. */
    const preset: AnfrageData = { ...emptyAnfrage, services: [] };
    const area = params.get('flaeche');
    const skirting = params.get('leisten');
    const joints = params.get('fugen');

    if (area) {
      preset.area = area;
      preset.services.push(workTypes[0].id);
    }
    if (skirting) {
      preset.skirting = skirting;
      preset.services.push(workTypes[1].id);
    }
    if (joints) {
      preset.joints = joints;
      preset.services.push(workTypes[2].id);
    }

    return preset;
  });

  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [sendError, setSendError] = useState('');

  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownStep = useRef(step);

  /* Nach jedem Schrittwechsel den Fokus auf die neue Überschrift setzen,
     damit Tastatur und Screenreader dem Formular folgen. Beim ersten Aufbau
     bleibt der Fokus, wo er ist. */
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [step]);

  const update = <K extends keyof AnfrageData>(key: K, value: AnfrageData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const text =
    (key: keyof AnfrageData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      update(key, e.target.value as AnfrageData[typeof key]);

  const toggleService = (id: string) =>
    setData((prev) => {
      const services = prev.services.includes(id)
        ? prev.services.filter((value) => value !== id)
        : [...prev.services, id];
      return { ...prev, services };
    });

  const message = useMemo(() => buildMessage(data), [data]);

  const goTo = (target: number) => {
    setErrors({});
    setStep(target);
    setFurthest((prev) => Math.max(prev, target));
  };

  const next = () => {
    const found = validateStep(step, data);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    goTo(Math.min(step + 1, lastStep));
  };

  const back = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  };

  /**
   * Vor dem Absenden noch einmal alle Schritte prüfen. Steckt der Fehler in
   * einem früheren Schritt, wird dorthin zurückgesprungen – sonst stünde die
   * Meldung neben einem Feld, das gar nicht sichtbar ist.
   */
  const validateAll = (upTo: number) => {
    for (let index = 0; index <= upTo; index += 1) {
      const found = validateStep(index, data);
      if (Object.keys(found).length) {
        if (index !== step) setStep(index);
        setErrors(found);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handoff = (channel: 'mail' | 'whatsapp') => {
    /* Der Umweg über E-Mail oder WhatsApp überträgt nichts an einen Server,
       die Einwilligung aus Schritt 5 ist dafür nicht nötig. */
    if (!validateAll(lastStep - 1)) return;
    if (channel === 'mail') {
      window.location.href = mailtoLink(`Anfrage Bodenverlegung – ${data.name}`, message);
    } else {
      window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    }
    setStatus('handoff');
  };

  const submit = async () => {
    if (!validateAll(lastStep)) return;

    /* Spamfalle: von Menschen nie ausgefüllt. Still abbrechen. */
    if (data.website.trim()) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    setSendError('');

    try {
      await sendAnfrage(data);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setSendError(error instanceof Error ? error.message : 'Unbekannter Fehler beim Versand.');
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < lastStep) {
      next();
      return;
    }
    if (hasFormEndpoint) {
      void submit();
    } else {
      handoff('mail');
    }
  };

  const restart = () => {
    setData({ ...emptyAnfrage, services: [] });
    setErrors({});
    setStatus('idle');
    setSendError('');
    setStep(0);
    setFurthest(0);
  };

  /* ----------------------------------------------------------- Abschluss */

  if (status === 'success' || status === 'handoff') {
    const sent = status === 'success';
    return (
      <div className={styles.done} role="status" aria-live="polite">
        <span className={styles.doneIcon}>
          <Icon name="check" size={26} />
        </span>
        <h3>{sent ? 'Anfrage ist raus' : 'Nachricht ist vorbereitet'}</h3>
        <p className="small">
          {sent
            ? `Vielen Dank, ${data.name.split(' ')[0] || 'für Ihre Anfrage'}. Ihre Angaben sind angekommen. Eine Rückmeldung kommt in der Regel innerhalb von 24 Stunden – wie gewünscht per ${data.contactPreference}.`
            : 'Ihre Anfrage wurde mit allen Angaben in Ihrem E-Mail-Programm beziehungsweise in WhatsApp geöffnet. Bitte dort noch auf Senden tippen – erst dann ist sie unterwegs.'}
        </p>

        <details className={styles.doneDetails}>
          <summary>Gesendete Angaben ansehen</summary>
          <pre className={styles.previewBox}>{message}</pre>
        </details>

        <div className={styles.doneActions}>
          <a href={whatsappLink(message)} className="btn btn--accent" target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} />
            {sent ? 'Etwas nachreichen' : 'Über WhatsApp senden'}
          </a>
          <button type="button" className="btn btn--ghost" onClick={restart}>
            <Icon name="arrow-right" size={17} />
            Neue Anfrage
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------ Formular */

  const current = steps[step];
  const percent = Math.round((step / lastStep) * 100);

  return (
    <div className={styles.wrap}>
      <ol className={styles.stepper}>
        {steps.map((item, index) => {
          const state = index === step ? 'current' : index < furthest || index < step ? 'done' : 'todo';
          return (
            <li key={item.id} className={styles.stepperItem}>
              <button
                type="button"
                className={styles.stepperBtn}
                data-state={state}
                aria-current={index === step ? 'step' : undefined}
                disabled={index > furthest}
                onClick={() => index <= furthest && goTo(index)}
              >
                <span className={styles.stepperDot}>
                  {index < step ? <Icon name="check" size={13} /> : index + 1}
                </span>
                <span className={styles.stepperLabel}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-valuetext={`Schritt ${step + 1} von ${steps.length}: ${current.label}`}
        />
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.panel} key={current.id}>
          <span className={styles.stepCount}>
            Schritt {step + 1} von {steps.length}
          </span>
          <h3 className={styles.stepHeading} ref={headingRef} tabIndex={-1}>
            <Icon name={current.icon} size={19} />
            {current.heading}
          </h3>
          <p className={styles.stepHint}>{current.hint}</p>

          {/* ---------------------------------------------- 1 · Leistung */}
          {step === 0 && (
            <fieldset className={styles.group}>
              <legend className="visually-hidden">Leistungen</legend>
              <div className={styles.choices}>
                {workTypes.map((type) => (
                  <label key={type.id} className={styles.choice}>
                    <input
                      type="checkbox"
                      checked={data.services.includes(type.id)}
                      onChange={() => toggleService(type.id)}
                    />
                    <Icon name={type.icon} size={19} />
                    <span>
                      <strong>{type.label}</strong>
                      <span className={styles.choiceHint}>{type.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.services && <FieldError text={errors.services} />}

              <div className={styles.field}>
                <label htmlFor="f-customerType">Art des Auftrags</label>
                <select
                  id="f-customerType"
                  className={styles.control}
                  value={data.customerType}
                  onChange={text('customerType')}
                >
                  {customerTypes.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </fieldset>
          )}

          {/* ------------------------------------------------ 2 · Umfang */}
          {step === 1 && (
            <fieldset className={styles.group}>
              <legend className="visually-hidden">Umfang der Arbeiten</legend>
              <div className={styles.rows}>
                <div className={styles.field}>
                  <label htmlFor="f-area">
                    Bodenfläche <span>(m², optional)</span>
                  </label>
                  <input
                    id="f-area"
                    className={styles.control}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    placeholder="z. B. 32"
                    value={data.area}
                    onChange={text('area')}
                    aria-invalid={Boolean(errors.area)}
                  />
                  {errors.area && <FieldError text={errors.area} />}
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-skirting">
                    Sockelleisten <span>(lfm, optional)</span>
                  </label>
                  <input
                    id="f-skirting"
                    className={styles.control}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    placeholder="z. B. 24"
                    value={data.skirting}
                    onChange={text('skirting')}
                    aria-invalid={Boolean(errors.skirting)}
                  />
                  {errors.skirting && <FieldError text={errors.skirting} />}
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-joints">
                    Fugen <span>(lfm, optional)</span>
                  </label>
                  <input
                    id="f-joints"
                    className={styles.control}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    placeholder="z. B. 8"
                    value={data.joints}
                    onChange={text('joints')}
                    aria-invalid={Boolean(errors.joints)}
                  />
                  {errors.joints && <FieldError text={errors.joints} />}
                </div>
              </div>

              <div className={styles.rows}>
                <div className={styles.field}>
                  <label htmlFor="f-oldFloor">Liegt noch ein alter Belag?</label>
                  <select id="f-oldFloor" className={styles.control} value={data.oldFloor} onChange={text('oldFloor')}>
                    {oldFloorOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-material">Material</label>
                  <select id="f-material" className={styles.control} value={data.material} onChange={text('material')}>
                    {materialOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className={styles.note}>
                <Icon name="info" size={16} />
                <span>
                  Entfernen und Abtransport eines alten Belags kommen nach Aufwand dazu. Boden und Leisten stellt der
                  Kunde; auf Wunsch suchen wir das Material gemeinsam aus.
                </span>
              </p>
            </fieldset>
          )}

          {/* --------------------------------------------- 3 · Ort & Termin */}
          {step === 2 && (
            <fieldset className={styles.group}>
              <legend className="visually-hidden">Ort und Wunschtermin</legend>
              <div className={styles.rows}>
                <div className={styles.field}>
                  <label htmlFor="f-place">Ort oder Postleitzahl</label>
                  <input
                    id="f-place"
                    className={styles.control}
                    type="text"
                    autoComplete="address-level2"
                    placeholder="z. B. 73430 Aalen"
                    value={data.place}
                    onChange={text('place')}
                    aria-invalid={Boolean(errors.place)}
                    required
                  />
                  {errors.place && <FieldError text={errors.place} />}
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-timeframe">Wunschzeitraum</label>
                  <select
                    id="f-timeframe"
                    className={styles.control}
                    value={data.timeframe}
                    onChange={text('timeframe')}
                  >
                    {timeframes.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="f-message">
                  Beschreibung <span>(optional – Räume, Untergrund, Besonderheiten)</span>
                </label>
                <textarea
                  id="f-message"
                  className={styles.control}
                  placeholder="z. B. Wohnzimmer und Flur, alter Teppich muss raus, Vinyl liegt bereit."
                  value={data.message}
                  onChange={text('message')}
                />
              </div>

              <p className={styles.note}>
                <Icon name="map-pin" size={16} />
                <span>
                  Einsatzgebiet: {business.serviceAreaLabel}, ca. {business.serviceRadiusKm} km Radius. Bei größeren
                  Aufträgen auch weiter. Der Vorlauf bis zum Termin beträgt {business.leadTime}.
                </span>
              </p>
            </fieldset>
          )}

          {/* ----------------------------------------------- 4 · Kontakt */}
          {step === 3 && (
            <fieldset className={styles.group}>
              <legend className="visually-hidden">Ihre Kontaktdaten</legend>
              <div className={styles.rows}>
                <div className={styles.field}>
                  <label htmlFor="f-name">Name</label>
                  <input
                    id="f-name"
                    className={styles.control}
                    type="text"
                    autoComplete="name"
                    placeholder="Vor- und Nachname"
                    value={data.name}
                    onChange={text('name')}
                    aria-invalid={Boolean(errors.name)}
                    required
                  />
                  {errors.name && <FieldError text={errors.name} />}
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-phone">
                    Telefon <span>(auch WhatsApp)</span>
                  </label>
                  <input
                    id="f-phone"
                    className={styles.control}
                    type="tel"
                    autoComplete="tel"
                    placeholder="0170 1234567"
                    value={data.phone}
                    onChange={text('phone')}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <FieldError text={errors.phone} />}
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-email">
                    E-Mail <span>(optional)</span>
                  </label>
                  <input
                    id="f-email"
                    className={styles.control}
                    type="email"
                    autoComplete="email"
                    placeholder="name@beispiel.de"
                    value={data.email}
                    onChange={text('email')}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <FieldError text={errors.email} />}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.pseudoLabel}>Rückmeldung am liebsten per</span>
                <div className={styles.segmented} role="group" aria-label="Bevorzugter Kontaktweg">
                  {contactPreferences.map((option) => (
                    <label key={option} className={styles.segment}>
                      <input
                        type="radio"
                        name="contactPreference"
                        value={option}
                        checked={data.contactPreference === option}
                        onChange={() => update('contactPreference', option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Spamfalle – für Menschen unsichtbar, für Bots verlockend. */}
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="f-website">Website (bitte frei lassen)</label>
                <input
                  id="f-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={data.website}
                  onChange={text('website')}
                />
              </div>
            </fieldset>
          )}

          {/* ------------------------------------------------- 5 · Prüfen */}
          {step === lastStep && (
            <div className={styles.group}>
              <dl className={styles.summary}>
                <SummaryRow
                  label="Leistungen"
                  value={data.services.length ? data.services.join(', ') : 'noch offen'}
                  onEdit={() => goTo(0)}
                />
                <SummaryRow
                  label="Umfang"
                  value={
                    [
                      data.area && `${data.area} m² Boden`,
                      data.skirting && `${data.skirting} lfm Leisten`,
                      data.joints && `${data.joints} lfm Fugen`,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'noch offen'
                  }
                  onEdit={() => goTo(1)}
                />
                <SummaryRow label="Alter Belag" value={data.oldFloor} onEdit={() => goTo(1)} />
                <SummaryRow label="Material" value={data.material} onEdit={() => goTo(1)} />
                <SummaryRow label="Ort" value={data.place} onEdit={() => goTo(2)} />
                <SummaryRow label="Wunschzeitraum" value={data.timeframe} onEdit={() => goTo(2)} />
                {data.message.trim() && (
                  <SummaryRow label="Beschreibung" value={data.message.trim()} onEdit={() => goTo(2)} />
                )}
                <SummaryRow
                  label="Kontakt"
                  value={[data.name, data.phone, data.email].filter(Boolean).join(' · ')}
                  onEdit={() => goTo(3)}
                />
                <SummaryRow label="Rückmeldung per" value={data.contactPreference} onEdit={() => goTo(3)} />
              </dl>

              {hasFormEndpoint ? (
                <>
                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      checked={data.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                    />
                    <span>
                      Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der Anfrage übermittelt und
                      gespeichert werden. Näheres in der <Link href="/datenschutz">Datenschutzerklärung</Link>.
                    </span>
                  </label>
                  {errors.consent && <FieldError text={errors.consent} />}
                </>
              ) : (
                <p className={styles.note}>
                  <Icon name="shield" size={16} />
                  <span>
                    Ihre Angaben werden nicht an diese Website übertragen. Mit einem Klick wird die fertige Nachricht in
                    Ihrem E-Mail-Programm beziehungsweise in WhatsApp geöffnet – erst dort entscheiden Sie, ob Sie sie
                    absenden. Näheres in der <Link href="/datenschutz">Datenschutzerklärung</Link>.
                  </span>
                </p>
              )}

              <details className={styles.preview}>
                <summary>Vollständige Nachricht anzeigen</summary>
                <pre className={styles.previewBox}>{message}</pre>
              </details>

              {status === 'error' && (
                <div className={styles.error} role="alert">
                  <Icon name="info" size={16} />
                  <span>
                    Die Anfrage konnte nicht übermittelt werden ({sendError}). Bitte noch einmal versuchen – oder die
                    Nachricht direkt per WhatsApp oder E-Mail senden, damit nichts verloren geht.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- Steuerung */}
        <div className={styles.nav}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={back}
            disabled={step === 0 || status === 'sending'}
          >
            <Icon name="arrow-right" size={17} className={styles.iconBack} />
            Zurück
          </button>

          {step < lastStep ? (
            <button type="submit" className="btn btn--accent btn--lg">
              Weiter
              <Icon name="arrow-right" size={17} />
            </button>
          ) : hasFormEndpoint ? (
            <button type="submit" className="btn btn--accent btn--lg" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Wird gesendet …
                </>
              ) : (
                <>
                  <Icon name="check" size={18} />
                  Anfrage absenden
                </>
              )}
            </button>
          ) : (
            <div className={styles.sendRow}>
              <button type="submit" className="btn btn--accent btn--lg">
                <Icon name="mail" size={18} />
                Per E-Mail senden
              </button>
              <button type="button" className="btn btn--lg" onClick={() => handoff('whatsapp')}>
                <Icon name="whatsapp" size={18} />
                Per WhatsApp
              </button>
            </div>
          )}
        </div>

        {status === 'error' && hasFormEndpoint && (
          <div className={styles.sendRow}>
            <button type="button" className="btn btn--ghost" onClick={() => handoff('whatsapp')}>
              <Icon name="whatsapp" size={18} />
              Stattdessen per WhatsApp
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => handoff('mail')}>
              <Icon name="mail" size={18} />
              Stattdessen per E-Mail
            </button>
          </div>
        )}

        <p className={styles.privacy}>
          <Icon name="shield" size={17} />
          <span>
            Diese Website setzt keine Cookies und bindet keine externen Dienste ein.{' '}
            {hasFormEndpoint
              ? 'Übermittelt werden ausschließlich die Angaben aus diesem Formular, und nur zur Bearbeitung Ihrer Anfrage.'
              : 'Es werden derzeit keine Formulardaten an einen Server übertragen.'}{' '}
            Mehr dazu in der <Link href="/datenschutz">Datenschutzerklärung</Link>. Sie erreichen mich auch direkt unter{' '}
            {business.phone}.
          </span>
        </p>
      </form>
    </div>
  );
}

function FieldError({ text }: { text: string }) {
  return (
    <p className={styles.fieldError} role="alert">
      <Icon name="info" size={15} />
      {text}
    </p>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className={styles.summaryRow}>
      <dt>{label}</dt>
      <dd>{value || '–'}</dd>
      <button type="button" className={styles.summaryEdit} onClick={onEdit}>
        Ändern
        <span className="visually-hidden"> – {label}</span>
      </button>
    </div>
  );
}
