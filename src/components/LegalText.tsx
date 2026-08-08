import React from 'react';

/**
 * Rendert Rechtstexte aus einer Rohtext-Datei.
 * Zeilenumbrüche bleiben erhalten, URLs und E-Mail-Adressen werden verlinkt,
 * Text zwischen fünf Rauten (#####Überschrift#####) wird als Überschrift ausgezeichnet.
 */
export default function LegalText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        const splitRegex =
          /(#####.+?#####|https?:\/\/[^\s]+?(?=[.,;:]?(?:\s|$))|www\.[^\s]+?(?=[.,;:]?(?:\s|$))|[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
        const parts = line.split(splitRegex);

        return (
          <React.Fragment key={i}>
            {parts.map((part, j) => {
              if (!part) return null;
              if (part.startsWith('#####') && part.endsWith('#####')) {
                return (
                  <strong key={j} style={{ display: 'block', marginTop: '24px', fontSize: '1.2em' }}>
                    {part.replace(/#####/g, '')}
                  </strong>
                );
              }
              if (part.match(/^https?:\/\//))
                return (
                  <a key={j} href={part} target="_blank" rel="noreferrer">
                    {part}
                  </a>
                );
              if (part.match(/^www\./))
                return (
                  <a key={j} href={`https://${part}`} target="_blank" rel="noreferrer">
                    {part}
                  </a>
                );
              if (part.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+$/))
                return (
                  <a key={j} href={`mailto:${part}`}>
                    {part}
                  </a>
                );
              return part;
            })}
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
}
