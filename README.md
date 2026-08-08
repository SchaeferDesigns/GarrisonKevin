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
