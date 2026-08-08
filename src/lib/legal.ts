import fs from 'fs';
import path from 'path';

/**
 * Liest einen Rechtstext aus src/content.
 * Die Dateien sind bewusst leer – die Texte werden vom Betreiber eingepflegt.
 */
export function readLegalText(file: 'impressum' | 'datenschutz'): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'src', 'content', `${file}.txt`), 'utf8').trim();
  } catch {
    return '';
  }
}
