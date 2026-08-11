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

### Domain setzen

Für Canonical-URLs, Sitemap und JSON-LD wird `NEXT_PUBLIC_SITE_URL` verwendet
(Fallback: `https://kevin-garrison.de`):

```bash
NEXT_PUBLIC_SITE_URL=https://ihre-domain.de npm run build
```

### Anfrageformular anbinden

Das Kontaktformular (`src/components/AnfrageForm.tsx`) führt in fünf Schritten
durch die Anfrage und schreibt sie am Ende direkt nach Supabase. Dafür genügen
zwei Variablen:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…
```

- **beide gesetzt:** Die Fotos gehen in den Bucket `anfragen`, die Anfrage als
  Zeile in die Tabelle `anfragen` (`src/lib/anfrage.ts`, Funktion
  `sendAnfrage`). In Schritt 5 erscheint zusätzlich die
  Einwilligungs-Checkbox.
- **eine fehlt:** Das Formular bleibt vollständig bedienbar und übergibt die
  fertige Nachricht am Ende an das E-Mail-Programm oder an WhatsApp. Es wird
  dann nichts übertragen; ausgewählte Dateien stehen nur namentlich in der
  Nachricht, weil `mailto:` keine Anhänge mitnimmt.

Der anon key ist **öffentlich**. Er wird beim Build in das ausgelieferte
JavaScript eingebacken und ist im Browser jedes Besuchers lesbar. In die
Repository-Variablen gehört er trotzdem – wegen Rotation und damit kein Key im
Quelltext steht –, aber die Sicherheit darf nicht von ihm abhängen. Sie liegt
vollständig in der Datenbank.

#### Einrichtung in Supabase

`supabase/migrations/20260810_anfragen.sql` im SQL-Editor ausführen. Mehrfaches
Ausführen ist unschädlich. Angelegt werden:

| | |
| --- | --- |
| Tabelle `public.anfragen` | RLS an, Policy **nur für INSERT**. Über die API kann niemand lesen, ändern oder löschen – die Anfragen sieht Kevin im Dashboard. |
| CHECK-Constraints | erzwingen echte Werte: Name ohne Ziffern, Telefonnummer im Format `0…`/`+…`, vollständige E-Mail-Adresse, mindestens ein Kontaktweg, Mengen in plausiblen Grenzen, Einwilligung zwingend. |
| Trigger `anfragen_bremse` | höchstens 30 Anfragen je Stunde. |
| Bucket `anfragen` | privat, 10 MB je Datei, nur Bilder und PDF. Policy erlaubt Hochladen, **nicht** Herunterladen. |
| `anfragen_aufraeumen(monate)` | löscht alte Anfragen, für einen späteren Cron-Job. |

Die Prüfung im Browser (`src/lib/anfrageRules.ts`) ist Komfort und liefert die
Meldungen; verbindlich sind die Constraints. Wer die Browserprüfung umgeht,
scheitert an der Datenbank – das Formular übersetzt die Ablehnung dann in einen
lesbaren Satz.

Die Sendebremse kann ohne IP nur global begrenzen. Bei einem Ansturm werden
also auch echte Anfragen abgewiesen; das Formular bietet in dem Fall WhatsApp
und E-Mail als Ausweg an, sodass keine Anfrage verloren geht.

#### Weiterleitung per E-Mail

Noch nicht eingerichtet. Der saubere Weg ohne Schlüssel im Frontend ist ein
**Database Webhook** in Supabase: bei jedem `INSERT` auf `public.anfragen` eine
Edge Function aufrufen, die `summary` per Resend an Kevin schickt. Der
Resend-Schlüssel liegt dann als Secret in Supabase und wird nie ausgeliefert.
Für Fotos in der E-Mail eignen sich signierte Links auf den Bucket besser als
Anhänge – die Mail bleibt klein, auch bei 30 MB.

## Deployment

### GitHub Pages (Testumgebung)

`.github/workflows/deploy.yml` baut bei jedem Push einen statischen Export und
veröffentlicht ihn auf GitHub Pages.

**Einmalig nötig:** **Repository → Settings → Pages → Source: „GitHub Actions"**.
Der Workflow versucht das zwar selbst, darf es aber nicht: Das Erstellen der
Pages-Site verlangt Administrationsrechte, die der Workflow-Token nicht hat.
Solange der Schalter nicht gesetzt ist, läuft der Build durch und nur der
Deploy-Schritt bricht mit 404 ab. Danach genügt ein erneuter Lauf
(„Re-run jobs" oder der nächste Push).

Die Adresse lautet dann `https://<owner>.github.io/<repo>/`.

Der Workflow setzt diese Umgebungsvariablen:

| Variable | Zweck |
| --- | --- |
| `NEXT_OUTPUT=export` | statischer Export statt Server-Build |
| `NEXT_PUBLIC_BASE_PATH` | Unterpfad, unter dem Pages ausliefert |
| `NEXT_PUBLIC_NOINDEX=true` | Testadresse wird nicht indexiert |
| `NEXT_PUBLIC_SUPABASE_URL` | Projekt der Anfragen-Datenbank |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | aus **Settings → Secrets and variables → Actions → Variables** (nicht Secrets: GitHub maskiert Secrets im Build, und der Wert muss ohnehin öffentlich sein) |

Fehlt die Variable, baut der Workflow trotzdem durch – das Formular läuft dann
im Übergabe-Modus über E-Mail und WhatsApp.

### Echte Domain

Sobald die richtige Domain steht:

1. `NEXT_PUBLIC_NOINDEX` im Workflow entfernen, damit die Seite indexiert wird
2. `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen
3. Bei eigener Domain auf Pages entfällt `NEXT_PUBLIC_BASE_PATH`
4. Auf einem Host mit Node.js entfällt `NEXT_OUTPUT` – dann greifen zusätzlich
   die Sicherheits-Header aus `next.config.mjs`

## Datenschutz

- Keine Cookies, kein Local Storage, daher kein Cookie-Banner erforderlich
- Keine Analyse-, Tracking- oder Kartendienste
- Schriften werden beim Build heruntergeladen und vom eigenen Server ausgeliefert
- Das Anfrageformular sendet erst mit gesetzten Supabase-Variablen an einen Server,
  und dann ausschließlich beim Absenden, mit ausdrücklicher Einwilligung. Ohne die
  Variablen erzeugt es nur eine Nachricht, die der Nutzer selbst per
  E-Mail-Programm oder WhatsApp versendet. Sobald die Anbindung steht, braucht die
  Datenschutzerklärung einen Abschnitt zu Speicherort (Supabase, EU) und
  Aufbewahrungsdauer
- Der Preisrechner rechnet ausschließlich im Browser

## Bildmedien

Die Holztexturen in `public/media/` und `public/og-image.jpg` wurden prozedural
erzeugt (Platzhalter im Sinne von Gestaltung, nicht von Inhalt). Sie sollten bei
Gelegenheit durch echte Fotos abgeschlossener Arbeiten ersetzt werden.
