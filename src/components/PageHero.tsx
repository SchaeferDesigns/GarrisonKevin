import Link from 'next/link';
import type { ReactNode } from 'react';
import { cssUrl } from '@/lib/assets';
import styles from './PageHero.module.css';

export type Crumb = { name: string; path: string };

type PageHeroProps = {
  kicker?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  image?: string;
};

/** Einheitlicher Seitenkopf für alle Unterseiten inklusive Brotkrümelnavigation. */
export default function PageHero({
  kicker,
  title,
  lead,
  crumbs = [],
  children,
  image = '/media/wood-dark.jpg',
}: PageHeroProps) {
  return (
    <section className={styles.hero} style={{ ['--hero-image' as string]: cssUrl(image) }}>
      <div className={styles.texture} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />
      <div className="container">
        <div className={styles.inner}>
          {crumbs.length > 0 && (
            <nav aria-label="Brotkrümelnavigation">
              <ol className={styles.crumbs}>
                <li>
                  <Link href="/">Start</Link>
                </li>
                {crumbs.map((crumb, i) => (
                  <li key={crumb.path}>
                    {i === crumbs.length - 1 ? (
                      <span aria-current="page">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.path}>{crumb.name}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {kicker && <span className="kicker">{kicker}</span>}
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={`lead ${styles.lead}`}>{lead}</p>}
          {children && <div className={styles.meta}>{children}</div>}
        </div>
      </div>
    </section>
  );
}
