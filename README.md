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
durch die Anfrage und sendet sie am Ende ab. Wohin, entscheidet eine einzige
Variable:

```bash
NEXT_PUBLIC_FORM_ENDPOINT=https://…   # Ziel für den POST
```

- **gesetzt:** Der letzte Schritt sendet die Anfrage samt Anhängen per `POST` an
  diese Adresse (`src/lib/anfrage.ts`, Funktion `sendAnfrage`). Zusätzlich
  erscheint die Einwilligungs-Checkbox in Schritt 5. Der Endpunkt muss mit einem
  2xx-Status antworten und CORS für die Website-Domain erlauben.
- **nicht gesetzt (aktueller Stand):** Das Formular bleibt vollständig
  bedienbar und übergibt die fertige Nachricht am Ende an das E-Mail-Programm
  oder an WhatsApp. Es werden dann keine Daten an einen Server übertragen. Der
  Upload in Schritt 3 funktioniert trotzdem – ausgewählte Dateien stehen aber
  nur namentlich in der Nachricht, weil `mailto:` keine Anhänge mitnimmt. Ein
  Hinweis unter der Liste sagt das den Besuchern.

#### Aufbau des Requests

Gesendet wird immer `multipart/form-data`, damit Fotos und PDF ohne Umweg
mitgehen (`buildFormData`):

| Feld | Inhalt |
| --- | --- |
| `payload` | kompletter Datensatz als JSON-Text (siehe unten) |
| `summary` | dieselbe Anfrage als Fließtext, direkt als E-Mail-Body nutzbar |
| `name`, `phone`, `email`, `place` | flach, für einfache Weiterleitungen |
| `fileCount` | Anzahl der Anhänge |
| `file0` … `fileN` | die Anhänge selbst |

`payload` stammt aus `buildPayload` und ist bewusst stabil aufgebaut:

```json
{
  "form": "anfrage",
  "submittedAt": "2026-08-09T12:00:00.000Z",
  "contact": { "name": "", "phone": "", "email": "", "preferredChannel": "" },
  "project": {
    "services": [], "areaSqm": "", "skirtingMeters": "", "jointMeters": "",
    "oldFloor": "", "material": "", "customerType": "", "place": "",
    "timeframe": "", "notes": ""
  },
  "attachments": [{ "name": "", "size": 0, "type": "" }],
  "consent": true,
  "summary": "fertig formatierte Fassung als Text"
}
```

Nicht gefragte Felder bleiben leer: Schritt 2 zeigt nur die Maße, die zur
Auswahl aus Schritt 1 passen, der Rest wird beim Weitergehen verworfen.

#### Anhänge

Erlaubt sind JPG, PNG, WebP, HEIC und PDF, bis 10 MB je Datei, höchstens 6
Dateien und zusammen 30 MB (Konstanten am Anfang von `src/lib/anfrage.ts`).
Geprüft wird im Browser; der Endpunkt sollte dieselben Grenzen noch einmal
durchsetzen. HEIC-Fotos von iPhones melden je nach Browser gar keinen MIME-Typ
und werden deshalb durchgelassen.

#### Beispiel Supabase Edge Function

```ts
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  const form = await req.formData();
  const payload = JSON.parse(String(form.get('payload')));

  const { data: row } = await supabase.from('anfragen')
    .insert({ payload, summary: form.get('summary') }).select('id').single();

  for (let i = 0; i < Number(form.get('fileCount')); i++) {
    const file = form.get(`file${i}`) as File;
    await supabase.storage.from('anfragen')
      .upload(`${row.id}/${file.name}`, file, { contentType: file.type });
  }

  await resend.emails.send({
    from: 'website@…', to: 'kevingarrison@outlook.de',
    subject: `Anfrage von ${form.get('name')}`,
    text: String(form.get('summary')),
  });

  return new Response('{"ok":true}', { headers: cors });
});
```

Gegen Spam-Bots gibt es ein verstecktes Honeypot-Feld; wird es ausgefüllt,
unterbleibt der Versand schon im Browser. Sobald ein Endpunkt aktiv ist, muss
die Datenschutzerklärung die Verarbeitung der Formulardaten und der Anhänge
abdecken – inklusive Speicherort und Aufbewahrungsdauer.

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
- Das Anfrageformular überträgt derzeit nichts an einen Server: Es erzeugt aus den
  Eingaben eine Nachricht, die der Nutzer selbst per E-Mail-Programm oder WhatsApp
  versendet. Erst mit gesetztem `NEXT_PUBLIC_FORM_ENDPOINT` wird direkt gesendet –
  dann mit Einwilligung und entsprechendem Abschnitt in der Datenschutzerklärung
- Der Preisrechner rechnet ausschließlich im Browser

## Bildmedien

Die Holztexturen in `public/media/` und `public/og-image.jpg` wurden prozedural
erzeugt (Platzhalter im Sinne von Gestaltung, nicht von Inhalt). Sie sollten bei
Gelegenheit durch echte Fotos abgeschlossener Arbeiten ersetzt werden.
