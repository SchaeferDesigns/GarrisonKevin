'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Verzögerung in Millisekunden für gestaffelte Einblendungen. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/* --------------------------------------------------------------------------
   Ein einziger, gemeinsam genutzter Beobachter für alle Elemente der Seite.
   Neben dem IntersectionObserver läuft eine Prüfung bei Scroll- und
   Größenänderungen: Sie fängt Elemente ab, die beim Sprung-Scrollen
   (Ankerlinks, Tastatur, Wiederherstellen der Scrollposition) übersprungen
   wurden und sonst dauerhaft unsichtbar blieben.
   -------------------------------------------------------------------------- */
const pending = new Set<Element>();
let observer: IntersectionObserver | null = null;
let frame = 0;

function show(el: Element) {
  el.classList.add('is-visible');
  pending.delete(el);
  observer?.unobserve(el);
  if (pending.size === 0) teardown();
}

function sweep() {
  frame = 0;
  const limit = window.innerHeight * 0.94;
  pending.forEach((el) => {
    if (el.getBoundingClientRect().top < limit) show(el);
  });
}

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(sweep);
}

function teardown() {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

function observe(el: Element) {
  if (typeof IntersectionObserver === 'undefined') {
    el.classList.add('is-visible');
    return;
  }

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && show(entry.target)),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    );
  }

  if (pending.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  pending.add(el);
  observer.observe(el);
  onScroll();
}

export default function Reveal({ children, delay = 0, as, className = '' }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    observe(el);
    return () => {
      pending.delete(el);
      observer?.unobserve(el);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
