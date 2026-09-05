import { cx } from "@/ui/cx";

/** Inline 24x24 stroke paths, so no icon package and no network request. */
const PATHS = {
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  sun: ["M12 4V2", "M12 22v-2", "M4 12H2", "M22 12h-2", "M6 6L4.5 4.5", "M19.5 19.5L18 18", "M6 18l-1.5 1.5", "M19.5 4.5L18 6"],
  moon: ["M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"],
  monitor: ["M3 5h18v11H3z", "M9 20h6", "M12 16v4"],
  arrowRight: ["M4 12h15", "M13 6l6 6-6 6"],
  external: ["M14 4h6v6", "M20 4l-8 8", "M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"],
  github: [
    "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  ],
  mail: ["M3 6h18v12H3z", "M3 7l9 6 9-6"],
  eye: ["M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  eyeOff: ["M4 4l16 16", "M10.6 6.2A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.3 3.9", "M6.5 7.6A17 17 0 0 0 2 12s3.6 6 10 6a9.6 9.6 0 0 0 3.6-.7", "M9.9 9.9a3 3 0 0 0 4.2 4.2"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 20a8 8 0 0 1 16 0"],
  circle: ["M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"],
} as const;

export type IconName = keyof typeof PATHS;

export type IconProps = {
  name: IconName;
  size?: 14 | 16 | 18 | 20 | 24;
  className?: string;
};

export function Icon({ name, size = 18, className }: IconProps) {
  return (
    <svg
      className={cx("ui-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
