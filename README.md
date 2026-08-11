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

Das Kontaktformular schickt die Anfrage an eine **AWS-Lambda-Funktion**, die sie
prüft und per **SES** an Kevin weiterleitet. Keine Datenbank, kein Speicher: die
Fotos hängen an der E-Mail, damit ist die E-Mail zugleich das Archiv.

Alles Nötige liegt in `aws/`:

| Datei | Inhalt |
| --- | --- |
| `aws/template.yaml` | SAM-Vorlage: Lambda, Function URL, SES-Rechte, Logs |
| `aws/lambda/index.mjs` | die Funktion selbst |
| `aws/lambda/rules.mjs` | Prüfregeln, erzeugt aus `src/lib/anfrageRules.ts` mit `npm run aws:sync` – nie von Hand bearbeiten |

#### Einrichten

```bash
# 1. In SES zwei Adressen verifizieren (Konsole -> Verified identities):
#    - Absender, z. B. website@kevin-garrison.de
#    - Empfänger, z. B. kevingarrison@outlook.de

# 2. Prüfregeln erzeugen und ausrollen
npm run aws:sync
cd aws
sam deploy --guided \
  --stack-name garrison-anfrage \
  --region eu-central-1 \
  --capabilities CAPABILITY_IAM
```

`sam deploy --guided` fragt die drei Parameter ab: `Absender`, `Empfaenger` und
`ErlaubteHerkunft` (Komma-Liste der Domains, von denen gesendet werden darf).

Am Ende gibt der Stack `FormularEndpunkt` aus. Diese Adresse gehört in die
Repository-Variablen unter **Settings → Secrets and variables → Actions →
Variables**:

```
NEXT_PUBLIC_FORM_ENDPOINT = https://<id>.lambda-url.eu-central-1.on.aws/
```

Fehlt die Variable, baut der Deploy trotzdem durch – das Formular bleibt voll
bedienbar und übergibt die Nachricht an das E-Mail-Programm oder an WhatsApp.

#### SES-Sandbox

Ein neues SES-Konto steckt in der Sandbox und darf nur an **verifizierte**
Adressen senden. Das genügt hier: Es geht ohnehin immer nur an Kevins Postfach.
Produktionszugang muss nur beantragt werden, wenn später auch eine
Eingangsbestätigung an die Kunden gehen soll.

#### Fotos

Bilder werden **im Browser verkleinert**, bevor sie losgehen: längste Kante 1600
Pixel, JPEG mit Qualität 0,82. Ein 12-MB-Handyfoto wird so zu rund 900 KB. Das
hält die Anfrage unter dem 6-MB-Limit einer Lambda Function URL und die E-Mail
klein genug für jedes Postfach. Erlaubt sind sechs Dateien, zusammen 4,5 MB nach
dem Verkleinern.

#### Schutz vor Missbrauch

- **Herkunftsprüfung:** nur die Domains aus `ErlaubteHerkunft`
- **Spamfalle:** ein verstecktes Feld; ist es ausgefüllt, passiert nichts
- **Sendebremse:** höchstens fünf Anfragen je IP und Stunde
- **Wertprüfung:** dieselben Regeln wie im Browser, hier verbindlich

Die Prüfung im Browser (`src/lib/anfrageRules.ts`) liefert die freundlichen
Meldungen; verbindlich ist die in der Lambda-Funktion. Wer die Browserprüfung
umgeht, bekommt einen 422 mit Begründung.

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
| `NEXT_PUBLIC_FORM_ENDPOINT` | Adresse der Lambda-Funktion, aus den Repository-Variablen |

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
- Das Anfrageformular sendet erst mit gesetztem `NEXT_PUBLIC_FORM_ENDPOINT`, und
  dann ausschließlich beim Absenden, mit ausdrücklicher Einwilligung. Die Angaben
  gehen an eine Lambda-Funktion in der gewählten AWS-Region und von dort als
  E-Mail weiter; gespeichert wird nichts. Sobald die Anbindung steht, braucht die
  Datenschutzerklärung einen Abschnitt dazu
- Der Preisrechner rechnet ausschließlich im Browser

## Bildmedien

Die Holztexturen in `public/media/` und `public/og-image.jpg` wurden prozedural
erzeugt (Platzhalter im Sinne von Gestaltung, nicht von Inhalt). Sie sollten bei
Gelegenheit durch echte Fotos abgeschlossener Arbeiten ersetzt werden.
