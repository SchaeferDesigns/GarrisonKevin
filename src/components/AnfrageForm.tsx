'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
import Icon, { type IconName } from './Icon';
import { business, mailtoLink, whatsappLink } from '@/lib/business';
import styles from './AnfrageForm.module.css';

const workTypes: { id: string; label: string; icon: IconName }[] = [
  { id: 'Bodenverlegung (Laminat, Vinyl, Klickboden)', label: 'Bodenverlegung', icon: 'plank' },
  { id: 'Sockelleisten montieren', label: 'Sockelleisten', icon: 'skirting' },
  { id: 'Acryl- & Silikonfugen', label: 'Fugen erneuern', icon: 'joint' },
  { id: 'Ausbesserung / Teilfläche', label: 'Ausbesserung', icon: 'ruler' },
  { id: 'Material gemeinsam aussuchen', label: 'Materialberatung', icon: 'handshake' },
];

const timeframes = [
  'So schnell wie möglich',
  'Innerhalb der nächsten 4 Wochen',
  'In 1–3 Monaten',
  'Zeitlich flexibel',
];

/**
 * Anfrageformular ohne Serververarbeitung: Aus den Eingaben wird eine fertige
 * Nachricht erzeugt, die der Nutzer selbst per E-Mail-Programm oder WhatsApp versendet.
 * Dadurch werden keine Daten an diese Website übertragen oder dort gespeichert.
 */
export default function AnfrageForm() {
  const params = useSearchParams();

  const [selected, setSelected] = useState<string[]>(() => {
    const pre: string[] = [];
    if (params.get('flaeche')) pre.push(workTypes[0].id);
    if (params.get('leisten')) pre.push(workTypes[1].id);
    if (params.get('fugen')) pre.push(workTypes[2].id);
    return pre.length ? pre : [workTypes[0].id];
  });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    place: '',
    area: params.get('flaeche') ?? '',
    skirting: params.get('leisten') ?? '',
    joints: params.get('fugen') ?? '',
    timeframe: timeframes[1],
    message: '',
  });

  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  const message = useMemo(() => {
    const lines = [
      'Anfrage über die Website',
      '',
      `Leistungen: ${selected.length ? selected.join(', ') : 'noch offen'}`,
    ];

    if (form.area) lines.push(`Bodenfläche: ca. ${form.area} m²`);
    if (form.skirting) lines.push(`Sockelleisten: ca. ${form.skirting} lfm`);
    if (form.joints) lines.push(`Fugen: ca. ${form.joints} lfm`);
    if (form.place) lines.push(`Ort: ${form.place}`);
    lines.push(`Wunschzeitraum: ${form.timeframe}`);

    if (form.message.trim()) {
      lines.push('', 'Beschreibung:', form.message.trim());
    }

    lines.push('', 'Kontakt:', form.name || '(Name)');
    if (form.phone) lines.push(`Telefon: ${form.phone}`);
    if (form.email) lines.push(`E-Mail: ${form.email}`);

    return lines.join('\n');
  }, [selected, form]);

  const validate = () => {
    if (!form.name.trim()) {
      setError('Bitte tragen Sie Ihren Namen ein, damit ich Sie ansprechen kann.');
      return false;
    }
    if (!form.phone.trim() && !form.email.trim()) {
      setError('Bitte hinterlassen Sie eine Telefonnummer oder eine E-Mail-Adresse für die Rückmeldung.');
      return false;
    }
    setError('');
    return true;
  };

  const submitMail = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.location.href = mailtoLink(`Anfrage Bodenverlegung – ${form.name}`, message);
  };

  const submitWhatsapp = () => {
    if (!validate()) return;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <form className={styles.form} onSubmit={submitMail} noValidate>
      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>
          <Icon name="ruler" size={15} />
          1 · Worum geht es?
        </legend>
        <div className={styles.choices}>
          {workTypes.map((type) => (
            <label key={type.id} className={styles.choice}>
              <input type="checkbox" checked={selected.includes(type.id)} onChange={() => toggle(type.id)} />
              <Icon name={type.icon} size={18} />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>
          <Icon name="calculator" size={15} />
          2 · Ungefährer Umfang
        </legend>
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
              value={form.area}
              onChange={set('area')}
            />
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
              value={form.skirting}
              onChange={set('skirting')}
            />
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
              value={form.joints}
              onChange={set('joints')}
            />
          </div>
        </div>

        <div className={styles.rows}>
          <div className={styles.field}>
            <label htmlFor="f-place">
              Ort / PLZ <span>(optional)</span>
            </label>
            <input
              id="f-place"
              className={styles.control}
              type="text"
              autoComplete="address-level2"
              placeholder="z. B. 73430 Aalen"
              value={form.place}
              onChange={set('place')}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="f-timeframe">Wunschzeitraum</label>
            <select id="f-timeframe" className={styles.control} value={form.timeframe} onChange={set('timeframe')}>
              {timeframes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
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
            value={form.message}
            onChange={set('message')}
          />
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>
          <Icon name="user" size={15} />
          3 · Ihre Kontaktdaten
        </legend>
        <div className={styles.rows}>
          <div className={styles.field}>
            <label htmlFor="f-name">Name</label>
            <input
              id="f-name"
              className={styles.control}
              type="text"
              autoComplete="name"
              required
              placeholder="Vor- und Nachname"
              value={form.name}
              onChange={set('name')}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="f-phone">
              Telefon <span>(oder E-Mail)</span>
            </label>
            <input
              id="f-phone"
              className={styles.control}
              type="tel"
              autoComplete="tel"
              placeholder="Für Rückfragen"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="f-email">
              E-Mail <span>(oder Telefon)</span>
            </label>
            <input
              id="f-email"
              className={styles.control}
              type="email"
              autoComplete="email"
              placeholder="name@beispiel.de"
              value={form.email}
              onChange={set('email')}
            />
          </div>
        </div>
      </fieldset>

      {error && (
        <p className={styles.error} role="alert">
          <Icon name="info" size={16} />
          {error}
        </p>
      )}

      <div className={styles.preview}>
        <button type="button" className={styles.previewToggle} onClick={() => setShowPreview((v) => !v)}>
          <Icon name={showPreview ? 'close' : 'document'} size={15} />
          {showPreview ? 'Vorschau schließen' : 'Vorschau der Nachricht anzeigen'}
        </button>
        {showPreview && <pre className={styles.previewBox}>{message}</pre>}
      </div>

      <div className={styles.actions}>
        <div className={styles.actionRow}>
          <button type="submit" className="btn btn--accent btn--lg">
            <Icon name="mail" size={18} />
            Per E-Mail senden
          </button>
          <button type="button" className="btn btn--lg" onClick={submitWhatsapp}>
            <Icon name="whatsapp" size={18} />
            Per WhatsApp senden
          </button>
        </div>

        <p className={styles.privacy}>
          <Icon name="shield" size={17} />
          <span>
            Diese Website verarbeitet keine Formulardaten. Mit einem Klick wird Ihre Nachricht in Ihrem eigenen
            E-Mail-Programm beziehungsweise in WhatsApp geöffnet – erst dort entscheiden Sie, ob Sie sie absenden. Es
            werden keine Cookies gesetzt und keine Daten an Dritte übermittelt. Mehr dazu in der{' '}
            <Link href="/datenschutz">Datenschutzerklärung</Link>. Sie erreichen mich auch direkt unter {business.phone}.
          </span>
        </p>
      </div>
    </form>
  );
}
