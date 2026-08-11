import type { SVGProps } from 'react';

/**
 * Schlankes Inline-Icon-Set. Bewusst ohne externe Icon-Bibliothek,
 * damit keine zusätzlichen Requests und keine Drittanbieter-Ressourcen entstehen.
 */
export type IconName =
  | 'plank'
  | 'skirting'
  | 'joint'
  | 'check'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'phone'
  | 'whatsapp'
  | 'mail'
  | 'map-pin'
  | 'clock'
  | 'shield'
  | 'calculator'
  | 'ruler'
  | 'euro'
  | 'chevron-down'
  | 'menu'
  | 'close'
  | 'document'
  | 'user'
  | 'sparkle'
  | 'calendar'
  | 'handshake'
  | 'info'
  | 'ban'
  | 'image';

const paths: Record<IconName, React.ReactNode> = {
  plank: (
    <>
      <rect x="2.5" y="5" width="19" height="4.5" rx="1" />
      <rect x="2.5" y="9.5" width="19" height="4.5" rx="1" />
      <rect x="2.5" y="14" width="19" height="4.5" rx="1" />
      <path d="M9 5v4.5M15.5 9.5V14M7 14v4.5" />
    </>
  ),
  skirting: (
    <>
      <path d="M3 4v13.5" />
      <path d="M3 17.5h18" />
      <path d="M3 17.5l3.5-3.5H21v3.5" />
      <path d="M21 14v3.5" />
    </>
  ),
  joint: (
    <>
      <path d="M5 4.5h8.5a2 2 0 0 1 2 2V9" />
      <path d="M15.5 9h2.2a1.3 1.3 0 0 1 1.3 1.3v1.2" />
      <path d="M19 11.5c0 2.2-1.6 3.4-1.6 5.2a1.6 1.6 0 0 0 3.2 0c0-1.8-1.6-3-1.6-5.2Z" />
      <path d="M5 4.5v6.2a2 2 0 0 0 2 2h6.5" />
    </>
  ),
  check: (
    <>
      <path d="M4.5 12.5l5 5 10-11" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M4 12h15.5" />
      <path d="M13.5 6l6 6-6 6" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M6.5 17.5l11-11" />
      <path d="M8.5 6.5h9v9" />
    </>
  ),
  phone: (
    <>
      <path d="M6.2 3.5h3l1.6 4-2 1.4a12.5 12.5 0 0 0 6.3 6.3l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.6 20.4l1.3-4.5A8.2 8.2 0 1 1 8.3 19l-4.7 1.4Z" />
      <path d="M9 8.6c.2 1 .7 2 1.5 2.9.8.8 1.8 1.4 2.9 1.6l.9-1.2 2 .9-.2 1.4c-.1.5-.6.9-1.2.9a7 7 0 0 1-6.6-6.6c0-.6.4-1.1.9-1.2l1.4-.2.9 2L9 8.6Z" />
    </>
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M12 6.8V12l3.4 2.1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.2 2.7v5.6c0 4.3-3 8-7.2 9.4-4.2-1.4-7.2-5.1-7.2-9.4V5.7L12 3Z" />
      <path d="M8.8 12l2.2 2.2 4.2-4.4" />
    </>
  ),
  calculator: (
    <>
      <rect x="4.5" y="2.8" width="15" height="18.4" rx="2.4" />
      <rect x="7.8" y="6" width="8.4" height="3.4" rx="1" />
      <path d="M8.2 13h.01M12 13h.01M15.8 13h.01M8.2 17h.01M12 17h.01M15.8 17h.01" />
    </>
  ),
  ruler: (
    <>
      <rect x="1.6" y="8.2" width="20.8" height="7.6" rx="1.8" transform="rotate(-8 12 12)" />
      <path d="M6.6 8.4v3M10.3 7.8v4.4M14 7.2v3M17.7 6.6v4.4" />
    </>
  ),
  euro: (
    <>
      <path d="M18 6.4A7 7 0 0 0 7.8 9m0 6A7 7 0 0 0 18 17.6" />
      <path d="M4.6 10.4h9M4.6 13.8h9" />
    </>
  ),
  'chevron-down': (
    <>
      <path d="M6 9.5l6 6 6-6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7.5h16M4 12h16M4 16.5h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  document: (
    <>
      <path d="M6 2.8h7l5 5v13.4H6Z" />
      <path d="M13 2.8v5h5" />
      <path d="M9 13h6M9 16.5h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.4L19.5 10l-5.6 1.6L12 17l-1.9-5.4L4.5 10l5.6-1.6L12 3Z" />
      <path d="M18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.4" y="5" width="17.2" height="16" rx="2.4" />
      <path d="M3.4 9.8h17.2M8.4 3v4M15.6 3v4" />
    </>
  ),
  handshake: (
    <>
      <path d="M2.8 12.5l3.4-3.4 3 .6 2.8-2.4 2.8 2.4 3-.6 3.4 3.4" />
      <path d="M8 15.2l2.4 2.4a1.7 1.7 0 0 0 2.4 0l4.6-4.6" />
      <path d="M6.2 9.1v6.1M17.8 9.1v6.1" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 11v5.2M12 7.9h.01" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M5.8 5.8l12.4 12.4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.6" width="18" height="14.8" rx="2" />
      <circle cx="8.6" cy="9.8" r="1.6" />
      <path d="M3.4 16.6l4.8-4.4 3.6 3.2 3.2-2.8 5.6 5" />
    </>
  ),
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number | string;
  title?: string;
};

export default function Icon({ name, size = 20, title, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
