/**
 * The icon set, drawn inline rather than pulled from a library.
 *
 * Chevrons are the one direction-sensitive glyph: in RTL a "forward" chevron
 * must point left. `[dir='rtl'] &` handles it with a flip rather than a second
 * icon, so there is no way for the two to drift apart.
 */

export type IconName =
  | 'home'
  | 'calendar'
  | 'wallet'
  | 'user'
  | 'users'
  | 'bell'
  | 'search'
  | 'star'
  | 'badge'
  | 'plus'
  | 'chevron'
  | 'pin'
  | 'clock'
  | 'cap'
  | 'book'
  | 'clipboard'
  | 'lock'
  | 'upload'
  | 'hourglass'
  | 'sparkle';

const PATHS: Record<IconName, React.ReactNode> = {
  home: (
    <path
      d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.4" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </g>
  ),
  wallet: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6.5" width="18" height="13" rx="2.2" />
      <path d="M3 10.5h18" />
      <circle cx="16.8" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
    </g>
  ),
  user: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.3 20c0-4.3 3.5-6.9 7.7-6.9s7.7 2.6 7.7 6.9" />
    </g>
  ),
  users: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.5" cy="8.3" r="3.1" />
      <path d="M3 19.5c0-3.6 2.6-5.7 5.5-5.7s5.5 2.1 5.5 5.7" />
      <circle cx="17" cy="9.2" r="2.4" />
      <path d="M15.3 13.9c2.3.3 3.9 2.1 4.2 4.6" />
    </g>
  ),
  bell: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10.2a6 6 0 0 1 12 0v4.6l1.6 2.4H4.4L6 14.8Z" />
      <path d="M10.2 20a1.9 1.9 0 0 0 3.6 0" />
    </g>
  ),
  search: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" />
      <line x1="16" y1="16" x2="20.5" y2="20.5" />
    </g>
  ),
  star: (
    <polygon
      points="12,2.5 15,9.2 22,9.8 16.6,14.3 18.2,21.3 12,17.6 5.8,21.3 7.4,14.3 2,9.8 9,9.2"
      fill="currentColor"
    />
  ),
  badge: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.3l2.6 2.6L16.2 9" />
    </g>
  ),
  plus: (
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </g>
  ),
  chevron: (
    <path
      d="M9 5l7 7-7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  pin: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-7.4 7-12.4a7 7 0 0 0-14 0C5 13.6 12 21 12 21Z" />
      <circle cx="12" cy="8.6" r="2.3" />
    </g>
  ),
  clock: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </g>
  ),
  cap: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6.5 11.7v3.8c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-3.8" />
      <path d="M21 9.5v5.2" />
    </g>
  ),
  book: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.8A1.8 1.8 0 0 1 5.8 3H19v18H5.8A1.8 1.8 0 0 1 4 19.2V4.8Z" />
      <path d="M4 17.2h15" />
      <path d="M8 7.5h7" />
      <path d="M8 11h7" />
    </g>
  ),
  clipboard: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4.5H7.2A1.7 1.7 0 0 0 5.5 6.2v13.1A1.7 1.7 0 0 0 7.2 21h9.6a1.7 1.7 0 0 0 1.7-1.7V6.2A1.7 1.7 0 0 0 16.8 4.5H15" />
      <rect x="9" y="2.8" width="6" height="3.4" rx="1.1" />
      <path d="M9.2 13.2l1.9 1.9 3.7-3.7" />
    </g>
  ),
  lock: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </g>
  ),
  upload: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15.5V19a1.8 1.8 0 0 0 1.8 1.8h12.4A1.8 1.8 0 0 0 20 19v-3.5" />
      <path d="M12 3.5v11.5" />
      <path d="m7.6 7.9 4.4-4.4 4.4 4.4" />
    </g>
  ),
  hourglass: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 3h11" />
      <path d="M6.5 21h11" />
      <path d="M7.5 3v3.6c0 1.9 4.5 3.6 4.5 5.4 0 1.8-4.5 3.5-4.5 5.4V21" />
      <path d="M16.5 3v3.6c0 1.9-4.5 3.6-4.5 5.4 0 1.8 4.5 3.5 4.5 5.4V21" />
    </g>
  ),
  sparkle: (
    <g fill="currentColor">
      <path d="M12 2.5l1.7 4.9 4.9 1.7-4.9 1.7L12 15.7l-1.7-4.9-4.9-1.7 4.9-1.7L12 2.5Z" />
      <path d="M18.5 14l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" />
      <path d="M5.5 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </g>
  ),
};

export function NavIcon({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName;
  className?: string;
}) {
  // The chevron is the one glyph whose meaning depends on reading direction.
  const directional = name === 'chevron' ? "rtl:-scale-x-100" : '';

  return (
    <svg viewBox="0 0 24 24" className={`${className} ${directional}`} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
