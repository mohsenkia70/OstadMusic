// components/logo-mark.tsx
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
   
      <circle
        cx="40"
        cy="40"
        r="37"
        stroke="url(#goldRing)"
        strokeWidth="1.15"
        opacity="0.9"
      />
      <circle
        cx="40"
        cy="40"
        r="32.8"
        stroke="url(#tealRing)"
        strokeWidth="0.7"
        opacity="0.4"
      />


      <path
        d="M26 55c1-8 5-13 10-15.5 2.5-1.2 5-3.5 5-7 0-3.5-2.5-5.8-5-7C31 23 27 18 26 10"
        stroke="url(#goldMain)"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />


      <path
        d="M54 55c-1-8-5-13-10-15.5-2.5-1.2-5-3.5-5-7 0-3.5 2.5-5.8 5-7 5-2.5 9-7.5 10-15.5"
        stroke="url(#goldMain)"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />


      <path
        d="M33 38h14"
        stroke="url(#tealMain)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M35 42h10"
        stroke="url(#tealMain)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M36 46h8"
        stroke="url(#tealMain)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />


      <path
        d="M40 18v38"
        stroke="url(#tealMain)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="40" cy="56" r="4.8" fill="url(#goldMain)" />

      <path
        d="M15 40c3-6 6-9 9-9"
        stroke="#14b8a6"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M65 40c-3-6-6-9-9-9"
        stroke="#14b8a6"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      <defs>
        <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="50%" stopColor="#d4a84b" />
          <stop offset="100%" stopColor="#a67c00" />
        </linearGradient>
        <linearGradient id="goldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d78c" />
          <stop offset="50%" stopColor="#d4a84b" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <linearGradient id="tealRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="tealMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
    </svg>
  );
}