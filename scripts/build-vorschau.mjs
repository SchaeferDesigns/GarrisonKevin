/**
 * Baut die Kundenvorschau der Agentur.
 *
 * Sie liegt nicht in der Wurzel einer Domain, sondern in einem Unterordner:
 * https://schaeferdesigns.de/demo/garrisonkevin/. Der Pfad wird beim Bauen fest
 * in jede erzeugte Datei geschrieben – wird der Ordner später umbenannt, gehen
 * sämtliche Verweise und Bilder kaputt. Deshalb steht er hier und nicht in
 * site.config.mjs: Dort würde er auch in den Bau für die echte Domain
 * durchschlagen und die Seite beim Livegang zerlegen.
 *
 * Aufruf:  npm run build:vorschau   ->  Ordner "out" für den Demo-Unterordner
 *          npm run build            ->  Ordner "out" für die echte Domain
 */
import { spawnSync } from 'node:child_process';

const unterordner = '/demo/garrisonkevin';

const umgebung = {
  ...process.env,
  NEXT_OUTPUT: 'export',
  NEXT_PUBLIC_BASE_PATH: unterordner,
  NEXT_PUBLIC_SITE_URL: `https://schaeferdesigns.de${unterordner}`,
  /* Die Vorschau ist öffentlich erreichbar. Ohne Sperre nähme Google sie auf,
     und später stünde sie in Konkurrenz zur echten Seite des Kunden. */
  NEXT_PUBLIC_NOINDEX: 'true',
};

console.log(`\n  Vorschau-Fassung für https://schaeferdesigns.de${unterordner}/`);
console.log('  Nicht für Suchmaschinen freigegeben.\n');

const lauf = spawnSync('npx', ['next', 'build'], { stdio: 'inherit', env: umgebung, shell: true });
process.exit(lauf.status ?? 1);
