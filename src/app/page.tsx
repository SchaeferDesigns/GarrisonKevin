import Link from 'next/link';
import type { Metadata } from 'next';
import Icon from '@/components/Icon';
import HeroFloor from '@/components/HeroFloor';
import StepTimeline from '@/components/StepTimeline';
import Reveal from '@/components/Reveal';
import FaqList from '@/components/FaqList';
import CtaSection from '@/components/CtaSection';
import {
  business,
  faqs,
  hourlyRate,
  notOffered,
  prices,
  processSteps,
  services,
  notOfferedExtra,
  trustPoints,
  whatsappLink,
} from '@/lib/business';
import styles from './home.module.css';

export const metadata: Metadata = {
  title: 'Bodenverlegung, Sockelleisten & Fugen in Aalen',
  description:
    'Laminat, Vinyl und Klickböden verlegen, Sockelleisten montieren, Silikonfugen erneuern – in Aalen und Umgebung. Ab 18 €/m² inklusive Trittschalldämmung, Besichtigung und schriftliches Angebot.',
  alternates: { canonical: '/' },
};

const serviceIcons = {
  plank: 'plank',
  skirting: 'skirting',
  joint: 'joint',
} as const;

const waText =
  'Hallo Herr Garrison, ich habe Ihre Website gesehen und möchte ein Angebot anfragen. Es geht um folgende Arbeiten:';

const waAreaText = 'Hallo Herr Garrison, kommen Sie auch nach ';

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <section className={`${styles.hero} on-dark`}>
        <HeroFloor />

        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className="kicker">Handwerk · Aalen &amp; Umgebung</span>
              <h1 className={styles.heroTitle}>
                Bodenverlegung
                <span className={styles.heroTitleLine}>
                  Laminat, Vinyl &amp; <em>Silikonfugen</em>
                </span>
              </h1>
              <p className={`lead ${styles.heroLead}`}>
                Laminat, Vinyl und Klickböden verlegen, Sockelleisten montieren, Acryl- und Silikonfugen erneuern.
                Termingerecht, fair kalkuliert – und nur die Arbeitsleistung, ohne versteckte Positionen.
              </p>

              <div className={styles.heroBadges}>
                <span className="badge badge--dark">
                  <Icon name="shield" size={15} />
                  Fester Ansprechpartner
                </span>
                <span className="badge badge--dark">
                  <Icon name="document" size={15} />
                  Schriftliches Angebot
                </span>
                <span className="badge badge--dark">
                  <Icon name="map-pin" size={15} />
                  {business.serviceRadiusKm} km um Aalen
                </span>
                <span className="badge badge--dark">
                  <Icon name="calendar" size={15} />
                  Aktuell {business.leadTimeShort}
                </span>
              </div>

              <div className={styles.heroActions}>
                <Link href="/kontakt" className="btn btn--accent btn--lg">
                  Besichtigung anfragen
                  <Icon name="arrow-right" size={18} />
                </Link>
                <a href={whatsappLink(waText)} className="btn btn--glass btn--lg" target="_blank" rel="noreferrer">
                  <Icon name="whatsapp" size={18} />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Preisanker: Orientierung sofort sichtbar, keine Preisrecherche nötig */}
            <aside className={styles.priceCard} aria-labelledby="hero-preise">
              <div className={styles.priceCardHead}>
                <span className={styles.priceCardTitle} id="hero-preise">
                  Richtwerte Arbeitsleistung
                </span>
              </div>
              <ul className={styles.priceRows}>
                {prices.map((price) => (
                  <li key={price.id} className={styles.priceRow}>
                    <span className={styles.priceLabel}>
                      {price.label}
                      <span className={styles.priceUnit}>{price.unit}</span>
                    </span>
                    <span className={styles.priceValue}>
                      <span>ab</span>
                      {price.from} €
                    </span>
                  </li>
                ))}
              </ul>
              <p className={styles.priceFoot}>
                Inklusive Dämmung und Anfahrt. Material stellt der Kunde. Verbindlich nach der Besichtigung.
              </p>
              <Link href="/leistungen#preise" className="btn btn--glass btn--block btn--sm">
                Alle Preise ansehen
                <Icon name="arrow-right" size={16} />
              </Link>
            </aside>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <Icon name="chevron-down" size={30} />
        </div>
      </section>

      {/* -------------------------------------------------------- Vertrauen */}
      <section className="section section--tight">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          {/* Traegt die Ueberschriftenfolge: ohne sie springt die Seite von der
              h1 direkt auf h3, und wer per Ueberschrift navigiert, verliert den Faden. */}
          <h2 className="visually-hidden">Was Sie erwarten können</h2>
          <Reveal>
            <div className={styles.trustStrip}>
              {trustPoints.map((point, i) => (
                <div key={point.title} className={styles.trustItem}>
                  <Icon
                    name={(['user', 'euro', 'calendar', 'sparkle'] as const)[i]}
                    size={22}
                    className={styles.trustIcon}
                  />
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- Leistungen */}
      <section className="section" id="leistungen">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Leistungen</span>
            <h2>Drei Leistungen aus einer Hand</h2>
            <p className="lead">
              Boden, Leisten und Fugen kommen aus einer Hand. Alle Preise gelten für die Arbeitsleistung, das Material
              stellt der Kunde.
            </p>
          </div>

          <div className="grid grid--3">
            {services.map((service, i) => {
              const price = prices.find((p) => p.id === service.priceId);
              return (
                <Reveal key={service.slug} delay={i * 90}>
                  <article className={`card card--link ${styles.serviceCard}`}>
                    <div>
                      <div className={styles.serviceHead}>
                        <span className="card__icon">
                          <Icon name={serviceIcons[service.icon]} size={23} />
                        </span>
                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                      </div>
                      <p className="mt-4 muted">{service.short}</p>
                    </div>

                    <div className={styles.serviceMeta}>
                      {price && (
                        <span className={styles.servicePrice}>
                          ab {price.from} €<span>{price.unit}</span>
                        </span>
                      )}
                      <Link href={`/leistungen/${service.slug}`} className="link">
                        Details
                        <Icon name="arrow-right" size={16} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="btn-row mt-8">
            <Link href="/leistungen" className="btn btn--ghost">
              Alle Leistungen im Überblick
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Ablauf */}
      <section className="section section--dark">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Ablauf</span>
            <h2>In fünf Schritten zum fertigen Boden</h2>
            <p className="lead">
              Die Preise auf dieser Seite sind Richtwerte. Verbindlich wird der Preis erst mit dem schriftlichen
              Angebot nach der Besichtigung.
            </p>
          </div>

          <Reveal>
            <StepTimeline steps={processSteps} />
          </Reveal>

          <div className="btn-row mt-8">
            <Link href="/ablauf" className="btn btn--glass">
              Ablauf im Detail
              <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/kontakt" className="btn btn--accent">
              Termin anfragen
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Klarheit */}
      <section className="section section--sand">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Klare Verhältnisse</span>
            <h2>Was enthalten ist – und was nicht</h2>
            <p className="lead">
              Ehrlichkeit vor dem Auftrag erspart Ärger danach. Deshalb steht hier auch, was ich bewusst nicht anbiete.
            </p>
          </div>

          <div className={styles.clarity}>
            <Reveal className={styles.clarityPanel}>
              <h3>Im Angebot enthalten</h3>
              <ul className="list">
                {[
                  'Verlegen von Laminat, Vinyl und Klickböden',
                  'Untergrund reinigen, grundieren und kleine Unebenheiten ausgleichen',
                  'Trittschalldämmung und Dampfsperre – im m²-Preis enthalten',
                  'Sockelleisten zuschneiden und montieren',
                  'Acryl- und Silikonfugen entfernen und neu ziehen',
                  'Ausbesserungen und Teilflächen, auch an Böden anderer Betriebe',
                  'Anfahrt im Einsatzgebiet',
                  'Besichtigung vor Ort und schriftliches Angebot',
                ].map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className={`${styles.clarityPanel} ${styles['clarityPanel--muted']}`} delay={110}>
              <h3>Nicht im Angebot</h3>
              <p className="small muted">
                Diese Beläge verlege ich nicht. Wenn Sie eines davon planen, sagen Sie mir gerne Bescheid – dann müssen
                wir beide keine Zeit investieren.
              </p>
              <ul className={styles.chipList}>
                {[...notOffered, ...notOfferedExtra].map((item) => (
                  <li key={item} className={styles.chip}>
                    <Icon name="ban" size={14} />
                    {item}
                  </li>
                ))}
              </ul>

              <hr className="rule" style={{ marginBlock: '0.5rem' }} />

              <h3>Gut zu wissen</h3>
              <ul className="list list--dense small">
                <li>
                  <Icon name="info" size={17} />
                  Material stellt der Kunde – auf Wunsch suchen wir es gemeinsam aus.
                </li>
                <li>
                  <Icon name="info" size={17} />
                  Kleine Aufträge unter {hourlyRate.thresholdOrderValue} €: ab {hourlyRate.amount} €/Std. (mind.{' '}
                  {hourlyRate.minHours.toLocaleString('de-DE')} Std.).
                </li>
                <li>
                  <Icon name="info" size={17} />
                  {business.vatNote}
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Einsatzgebiet */}
      <section className="section section--dark">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className={styles.areaGrid}>
            <Reveal>
              <div className={styles.radiusVisual}>
                <span className={styles.radiusRing} aria-hidden="true" />
                <span className={styles.radiusRing} aria-hidden="true" />
                <span className={styles.radiusRing} aria-hidden="true" />
                <span className={styles.radiusCore}>
                  <Icon name="map-pin" size={22} style={{ color: 'var(--oak-400)' }} />
                  <span className={styles.radiusValue}>{business.serviceRadiusKm} km</span>
                  <span className={styles.radiusLabel}>Radius um Aalen</span>
                </span>
              </div>
            </Reveal>

            <div>
              <span className="kicker">Einsatzgebiet</span>
              <h2 className="mt-4">Aalen und Umgebung</h2>
              <p className="lead mt-4">
                Gearbeitet wird in einem Radius von rund {business.serviceRadiusKm} Kilometern um Aalen. Die Anfahrt
                innerhalb des Einsatzgebiets ist im Preis enthalten. Bei größeren Aufträgen sind auch weitere Wege
                möglich.
              </p>

              <p className="mt-4">
                Ob Ihre Baustelle dazugehört, klären wir in einem Satz – fragen Sie einfach kurz nach.
              </p>

              <div className="btn-row mt-6">
                <a href={whatsappLink(waAreaText)} className="btn btn--glass" target="_blank" rel="noreferrer">
                  <Icon name="whatsapp" size={17} />
                  Kurz nachfragen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- FAQ */}
      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <div className="section-head section-head--center">
            <span className="kicker kicker--plain">Häufige Fragen</span>
            <h2>Fragen und Antworten</h2>
          </div>

          <FaqList items={faqs.slice(0, 5)} openFirst />

          <div className="btn-row btn-row--center mt-8">
            <Link href="/faq" className="btn btn--ghost">
              Alle Fragen und Antworten
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
