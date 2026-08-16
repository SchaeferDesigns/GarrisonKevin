import fs from 'fs';
import path from 'path';

/** Die Rechtstexte der Seite. Reihenfolge wie im Fußbereich. */
export const legalPages = [
  { slug: 'impressum', title: 'Impressum' },
  { slug: 'datenschutz', title: 'Datenschutz' },
  { slug: 'agb', title: 'AGB' },
  { slug: 'widerrufsbelehrung', title: 'Widerrufsbelehrung' },
] as const;

export type LegalSlug = (typeof legalPages)[number]['slug'];

/**
 * Liest einen Rechtstext aus src/content.
 *
 * Die Dateien sind HTML und bewusst leer – die Texte kommen vom Betreiber
 * beziehungsweise seinem Anwalt. HTML statt Rohtext, weil die Generatoren für
 * Impressum, Datenschutz und Widerruf ihre Texte ohnehin als HTML ausgeben:
 * Überschriften, Listen und Links kommen damit fertig ausgezeichnet an und
 * müssen nicht über eigene Zeichen nachgebaut werden.
 *
 * Gelesen wird beim Bauen, nicht im Browser. Der Inhalt stammt also aus dem
 * eigenen Verzeichnis und nicht von außen.
 */
export function readLegalText(file: LegalSlug): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'src', 'content', `${file}.html`), 'utf8').trim();
  } catch {
    return '';
  }
}
