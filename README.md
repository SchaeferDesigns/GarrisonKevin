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

Der Workflow setzt drei Umgebungsvariablen:

| Variable | Zweck |
| --- | --- |
| `NEXT_OUTPUT=export` | statischer Export statt Server-Build |
| `NEXT_PUBLIC_BASE_PATH` | Unterpfad, unter dem Pages ausliefert |
| `NEXT_PUBLIC_NOINDEX=true` | Testadresse wird nicht indexiert |

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
- Das Anfrageformular überträgt nichts an den Server: Es erzeugt aus den Eingaben
  eine Nachricht, die der Nutzer selbst per E-Mail-Programm oder WhatsApp versendet
- Der Preisrechner rechnet ausschließlich im Browser

## Bildmedien

Die Holztexturen in `public/media/` und `public/og-image.jpg` wurden prozedural
erzeugt (Platzhalter im Sinne von Gestaltung, nicht von Inhalt). Sie sollten bei
Gelegenheit durch echte Fotos abgeschlossener Arbeiten ersetzt werden.
