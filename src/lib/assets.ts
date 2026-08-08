/**
 * Pfad-Helfer für statische Dateien.
 *
 * Next.js ergänzt den Basispfad automatisch bei <Link> und next/image,
 * nicht aber bei `url()` in CSS. Damit die Hintergrundbilder auch unter
 * einem Unterpfad (z. B. GitHub Pages: /GarrisonKevin) gefunden werden,
 * laufen sie über diesen Helfer und werden als CSS-Variablen gesetzt.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${basePath}${path}`;

export const cssUrl = (path: string) => `url("${asset(path)}")`;

/** Wird nicht indexiert, solange die Seite nur auf einer Testdomain läuft. */
export const noIndex = process.env.NEXT_PUBLIC_NOINDEX === 'true';
