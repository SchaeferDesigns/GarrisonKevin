# Kevin Garrison – Bodenverlegung, Sockelleisten & Fugenarbeiten

Website für den Handwerksbetrieb Kevin Garrison (Aalen und Umgebung). Next.js App Router,
serverseitig statisch generiert, ohne Cookies und ohne externe Dienste.

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Produktions-Build
npm run start      # Produktionsserver
npm run typecheck  # TypeScript prüfen
```

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/lib/business.ts` | **Zentrale Stammdaten**: Kontakt, Preise, Leistungen, FAQ, Einsatzgebiet |
| `src/lib/schema.ts` | Strukturierte Daten (JSON-LD) für Suchmaschinen und KI-Systeme |
| `src/content/*.txt` | Rechtstexte (Impressum, Datenschutz) als Rohtext |
| `src/app/` | Seiten (App Router, echte Unterseiten mit Routing) |
| `src/components/` | Wiederverwendbare Bausteine |
| `public/media/` | Bildmedien |

### Inhalte pflegen

Fast alle Texte, die sich ändern können, stehen in `src/lib/business.ts`:
Telefonnummer, E-Mail, Adresse, Preise, Leistungsbeschreibungen, FAQ-Einträge,
Orte im Einsatzgebiet und Erreichbarkeitszeiten. Eine Änderung dort wirkt sich
auf alle Seiten inklusive der strukturierten Daten aus.

### Rechtstexte

`src/content/impressum.txt` und `src/content/datenschutz.txt` sind bewusst leer.
Sobald dort Text steht, wird er automatisch gerendert. Formatierung:

- Absätze und Zeilenumbrüche bleiben erhalten
- Überschriften: `#####Überschrift#####`
- URLs und E-Mail-Adressen werden automatisch verlinkt

### Livegang

Alle Schalter stehen in **`site.config.mjs`** im Hauptverzeichnis. Das ist die
einzige Datei, die dafür angefasst werden muss:

```js
export const seite = {
  domain: 'https://garrison-bodentechnik.de',  // echte Adresse, ohne Schrägstrich am Ende
  unterordner: '',                      // nur bei Ablage in einem Unterordner
  statischeDateien: true,               // true = reine HTML-Dateien in "out"
};
```

Die eingetragene Domain zieht durch die ganze Seite: Canonical-Adressen,
Sitemap, `robots.txt`, die strukturierten Daten für Google und die
Vorschaubilder beim Teilen. Solange das Feld leer ist, wird die Seite
automatisch für Suchmaschinen gesperrt – eine halbfertige Adresse soll nicht in
den Index geraten. Mit eingetragener Domain fällt die Sperre von selbst weg.

Umgebungsvariablen (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH`,
`NEXT_OUTPUT`, `NEXT_PUBLIC_NOINDEX`) haben weiterhin Vorrang. Nur deshalb kann
der Workflow für die Testumgebung eigene Werte setzen, ohne eine Datei im
Projekt zu ändern.

## Deployment

### Auf normalem Webspace (der Regelfall)

Es wird kein Node.js auf dem Server gebraucht. Gebaut wird auf dem eigenen
Rechner, hochgeladen werden fertige Dateien.

```bash
npm install     # nur beim ersten Mal
npm run build
```

Danach liegt im Ordner **`out`** die vollständige Seite. Dessen *Inhalt* kommt
per FTP in das Web-Verzeichnis des Anbieters (je nach Hoster `htdocs`,
`public_html` oder `www`) – nicht der Ordner selbst, sondern das, was darin
liegt.

Weil die Seite Verzeichnisse mit `index.html` erzeugt, funktionieren alle
Unterseiten ohne Umschreibungsregeln. Eine `.htaccess` ist nicht nötig.

Bei jeder inhaltlichen Änderung: erneut `npm run build`, `out` neu hochladen.

### Kundenvorschau der Agentur

Die Vorschau liegt in einem Unterordner unter
`https://schaeferdesigns.de/demo/garrisonkevin/`:

```bash
npm run build:vorschau
```

Der Unterpfad und die Indexierungssperre stehen in
`scripts/build-vorschau.mjs` und bewusst **nicht** in `site.config.mjs` – dort
würden sie auch in den Bau für die echte Domain durchschlagen und beim Livegang
sämtliche Verweise und Bilder ins Leere laufen lassen. `npm run build` bleibt
dadurch immer der Bau für die echte Domain.

Der Pfad wird beim Bauen fest in jede erzeugte Datei geschrieben. Wird der
Ordner auf dem Server umbenannt, muss neu gebaut werden.

### Auf einem Anbieter mit Node.js

In `site.config.mjs` `statischeDateien: false` setzen, dann `npm run build` und
`npm run start`. In dieser Betriebsart setzt die Seite zusätzlich eigene
Sicherheits-Header, die beim statischen Export nicht möglich sind.

### GitHub Pages (nur noch Testumgebung)

`.github/workflows/deploy.yml` baut bei jedem Push einen Export und
veröffentlicht ihn unter `https://<owner>.github.io/<repo>/`. Das dient der
Abstimmung während der Entwicklung; die Seite läuft dort nicht im Wirkbetrieb.
Diese Fassung wird nicht indexiert, solange die Repository-Variable
`SITE_DOMAIN` leer ist.

**Einmalig nötig:** **Repository → Settings → Pages → Source: „GitHub Actions"**.
Der Workflow versucht das zwar selbst, darf es aber nicht: Das Erstellen der
Pages-Site verlangt Administrationsrechte, die der Workflow-Token nicht hat.

Wird die Testumgebung nicht mehr gebraucht, kann `.github/workflows/deploy.yml`
ersatzlos gelöscht werden. Auf den Rest des Projekts hat das keine Auswirkung.

## Datenschutz

- Keine Cookies, kein Local Storage, daher kein Cookie-Banner erforderlich
- Keine Analyse-, Tracking- oder Kartendienste
- Schriften werden beim Build heruntergeladen und vom eigenen Server ausgeliefert
- Kein Kontaktformular: Die Kontaktseite nennt nur Telefon, WhatsApp und E-Mail.
  Es werden also keinerlei Daten an einen Server übertragen
- Der Preisrechner rechnet ausschließlich im Browser

## Bildmedien

Die Holztexturen in `public/media/` und `public/og-image.jpg` wurden prozedural
erzeugt (Platzhalter im Sinne von Gestaltung, nicht von Inhalt). Sie sollten bei
Gelegenheit durch echte Fotos abgeschlossener Arbeiten ersetzt werden.
