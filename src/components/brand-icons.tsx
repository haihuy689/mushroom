import type { ReactNode } from "react";

type BrandIconProps = {
  className?: string;
};

export type BenefitIconName =
  | "basket"
  | "checklist"
  | "community"
  | "gear"
  | "leaf"
  | "shield"
  | "truck"
  | "pi";

export function PiNetworkIcon({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="29" fill="currentColor" opacity="0.14" />
      <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="4" />
      <path
        d="M21 23.4H43"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5.2"
      />
      <path
        d="M27 23.5V43.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5.2"
      />
      <path
        d="M37 23.5V43.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5.2"
      />
      <circle cx="27" cy="16.8" r="3.3" fill="currentColor" />
      <circle cx="37" cy="16.8" r="3.3" fill="currentColor" />
    </svg>
  );
}

export function MushroomPiLogoMark({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="96" height="96" rx="26" fill="url(#logoBg)" />
      <path
        d="M17.5 43C20.5 25.6 32.7 16 48.1 16C63.4 16 75.5 25.6 78.5 43H17.5Z"
        fill="#FFF1C7"
      />
      <path
        d="M17.5 43C20.5 25.6 32.7 16 48.1 16C63.4 16 75.5 25.6 78.5 43H17.5Z"
        fill="url(#capShade)"
      />
      <path
        d="M38.5 43H57.5V69.4C57.5 75.4 53.2 80 48 80C42.8 80 38.5 75.4 38.5 69.4V43Z"
        fill="#F8E7BE"
      />
      <path
        d="M38.5 43H57.5V69.4C57.5 75.4 53.2 80 48 80C42.8 80 38.5 75.4 38.5 69.4V43Z"
        fill="url(#stemShade)"
      />
      <path
        d="M30.5 50H65.5"
        stroke="#7B4B22"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.32"
      />
      <circle cx="33" cy="30" r="4" fill="#8B4B22" opacity="0.9" />
      <circle cx="48" cy="25.5" r="4.5" fill="#8B4B22" opacity="0.9" />
      <circle cx="62.5" cy="31" r="3.8" fill="#8B4B22" opacity="0.9" />
      <g transform="translate(56 54)">
        <circle cx="14" cy="14" r="14" fill="#6D198E" />
        <path
          d="M6.7 10.2H21.3M10.7 10.3V22.8M17.3 10.3V22.8"
          stroke="#FFE58D"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        <circle cx="10.7" cy="5.8" r="1.8" fill="#FFE58D" />
        <circle cx="17.3" cy="5.8" r="1.8" fill="#FFE58D" />
      </g>
      <defs>
        <linearGradient id="logoBg" x1="10" y1="8" x2="88" y2="92">
          <stop stopColor="#F6BD54" />
          <stop offset="0.58" stopColor="#9A5529" />
          <stop offset="1" stopColor="#385D34" />
        </linearGradient>
        <linearGradient id="capShade" x1="24" y1="18" x2="74" y2="48">
          <stop stopColor="#FFF8DD" stopOpacity="0.98" />
          <stop offset="1" stopColor="#D59A46" stopOpacity="0.56" />
        </linearGradient>
        <linearGradient id="stemShade" x1="43" y1="43" x2="58" y2="78">
          <stop stopColor="#FFF9E8" />
          <stop offset="1" stopColor="#D7B26C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BenefitIcon({
  className,
  name,
}: BrandIconProps & {
  name: BenefitIconName;
}) {
  if (name === "pi") {
    return <PiNetworkIcon className={className} />;
  }

  const paths: Record<Exclude<BenefitIconName, "pi">, ReactNode> = {
    basket: (
      <>
        <path d="M19 31H45L40.8 50H23.2L19 31Z" fill="currentColor" opacity="0.2" />
        <path d="M23 31L32 18L41 31" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
        <path d="M18 31H46L41.8 50H22.2L18 31Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
      </>
    ),
    checklist: (
      <>
        <rect x="17" y="12" width="30" height="40" rx="8" fill="currentColor" opacity="0.18" />
        <path d="M24 28L29 33L40 22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <path d="M25 43H40" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
      </>
    ),
    community: (
      <>
        <circle cx="32" cy="24" r="8" fill="currentColor" opacity="0.24" />
        <circle cx="18" cy="31" r="6" fill="currentColor" opacity="0.2" />
        <circle cx="46" cy="31" r="6" fill="currentColor" opacity="0.2" />
        <path d="M18 49C20.6 42.8 25.4 39.5 32 39.5C38.6 39.5 43.4 42.8 46 49" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
      </>
    ),
    gear: (
      <>
        <path d="M32 19V13M32 51V45M45.5 32H51.5M12.5 32H18.5M41.6 22.4L45.8 18.2M18.2 45.8L22.4 41.6M41.6 41.6L45.8 45.8M18.2 18.2L22.4 22.4" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
        <circle cx="32" cy="32" r="11" fill="currentColor" opacity="0.18" />
        <circle cx="32" cy="32" r="7" stroke="currentColor" strokeWidth="4" />
      </>
    ),
    leaf: (
      <>
        <path d="M17 37C31 36 40.5 27 44 13C49 29 41 47 22 52" fill="currentColor" opacity="0.18" />
        <path d="M17 37C31 36 40.5 27 44 13C49 29 41 47 22 52" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.6" />
        <path d="M22 52C27 42 34.5 35.5 45 31" stroke="currentColor" strokeLinecap="round" strokeWidth="4.6" />
      </>
    ),
    shield: (
      <>
        <path d="M32 10L49 17V30C49 41 42.4 49.5 32 54C21.6 49.5 15 41 15 30V17L32 10Z" fill="currentColor" opacity="0.18" />
        <path d="M32 10L49 17V30C49 41 42.4 49.5 32 54C21.6 49.5 15 41 15 30V17L32 10Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="4.4" />
        <path d="M24.5 31.5L30 37L41 25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      </>
    ),
    truck: (
      <>
        <path d="M10 22H38V41H10V22Z" fill="currentColor" opacity="0.18" />
        <path d="M38 28H48L55 36V41H38V28Z" fill="currentColor" opacity="0.18" />
        <path d="M10 22H38V41H10V22ZM38 28H48L55 36V41H38V28Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="4.2" />
        <circle cx="20" cy="45" r="5" stroke="currentColor" strokeWidth="4" />
        <circle cx="46" cy="45" r="5" stroke="currentColor" strokeWidth="4" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
