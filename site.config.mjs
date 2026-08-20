/**
 * ===========================================================================
 *  EINSTELLUNGEN FÜR DEN LIVEGANG
 *  Dies ist die einzige Datei, die dafür angefasst werden muss.
 *  Nach jeder Änderung neu bauen:  npm run build
 * ===========================================================================
 */
export const seite = {
  /**
   * Die Adresse, unter der die Seite später erreichbar ist.
   * Mit https:// davor, ohne Schrägstrich am Ende.
   *
   *   Beispiel:  domain: 'https://kevin-garrison.de',
   *
   * Solange hier nichts steht, gilt die Seite als Testfassung: Suchmaschinen
   * werden ausgesperrt, damit eine halbfertige Adresse nicht bei Google landet.
   * Sobald die echte Domain hier steht, wird die Sperre automatisch aufgehoben
   * und Sitemap, Canonical-Adressen und die Daten für Google zeigen dorthin.
   */
  domain: '',

  /**
   * Nur ausfüllen, wenn die Seite NICHT direkt unter der Domain liegt,
   * sondern in einem Unterordner.
   *
   *   kevin-garrison.de           -> hier nichts eintragen
   *   kevin-garrison.de/website   -> unterordner: '/website',
   */
  unterordner: '',

  /**
   * true  = Die Seite wird zu reinen HTML-Dateien im Ordner "out" gebaut.
   *         Die laufen auf jedem Webspace, auch ohne Node.js. Der Inhalt von
   *         "out" wird per FTP in das Web-Verzeichnis hochgeladen.
   *
   * false = Betrieb mit laufendem Node.js-Server (npm run start). Nur wählen,
   *         wenn der Anbieter Node.js anbietet. Dann setzt die Seite
   *         zusätzlich eigene Sicherheits-Header.
   */
  statischeDateien: true,
};
