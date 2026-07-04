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
      <circle cx="25" cy="15" r="5.2" fill="currentColor" />
      <circle cx="39" cy="15" r="5.2" fill="currentColor" />
      <path
        d="M15 26C15 23.3 17.1 21.2 19.8 21.2H46.2C48.9 21.2 51 23.3 51 26C51 28.7 48.9 30.8 46.2 30.8H43.8V49.2C43.8 52.1 41.5 54.4 38.6 54.4C35.7 54.4 33.4 52.1 33.4 49.2V30.8H30.6V49.2C30.6 52.1 28.3 54.4 25.4 54.4C22.5 54.4 20.2 52.1 20.2 49.2V30.8H19.8C17.1 30.8 15 28.7 15 26Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MushroomLogoMark({ className }: BrandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 43.5C22.7 25 33.5 14.5 48 14.5C62.5 14.5 73.3 25 76 43.5H20Z"
        fill="#8B4B22"
      />
      <path
        d="M20 43.5C22.7 25 33.5 14.5 48 14.5C62.5 14.5 73.3 25 76 43.5H20Z"
        fill="url(#capShade)"
      />
      <path
        d="M20 43.5C22.7 25 33.5 14.5 48 14.5C62.5 14.5 73.3 25 76 43.5H20Z"
        stroke="#5C2D17"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path
        d="M34.5 43.5H61.5V70.5C61.5 78 55.8 83.5 48 83.5C40.2 83.5 34.5 78 34.5 70.5V43.5Z"
        fill="#F2D196"
      />
      <path
        d="M34.5 43.5H61.5V70.5C61.5 78 55.8 83.5 48 83.5C40.2 83.5 34.5 78 34.5 70.5V43.5Z"
        fill="url(#stemShade)"
      />
      <path
        d="M34.5 43.5H61.5V70.5C61.5 78 55.8 83.5 48 83.5C40.2 83.5 34.5 78 34.5 70.5V43.5Z"
        stroke="#7B4B22"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M18.5 43.5H77.5"
        stroke="#7B4B22"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M37.5 45H58.5"
        stroke="#7B4B22"
        strokeLinecap="round"
        strokeWidth="3.5"
        opacity="0.24"
      />
      <circle cx="33" cy="31" r="4.2" fill="#FFF1C7" />
      <circle cx="48" cy="25.5" r="4.8" fill="#FFF1C7" />
      <circle cx="62.5" cy="31.5" r="4" fill="#FFF1C7" />
      <circle cx="40.2" cy="36.5" r="2.6" fill="#FFF1C7" opacity="0.86" />
      <circle cx="56.6" cy="37" r="2.4" fill="#FFF1C7" opacity="0.86" />
      <defs>
        <linearGradient id="capShade" x1="24" y1="18" x2="74" y2="48">
          <stop stopColor="#B66D2F" />
          <stop offset="0.72" stopColor="#7E421D" />
          <stop offset="1" stopColor="#5C2D17" />
        </linearGradient>
        <linearGradient id="stemShade" x1="43" y1="43" x2="58" y2="78">
          <stop stopColor="#FFF2D2" />
          <stop offset="1" stopColor="#C98E48" />
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
