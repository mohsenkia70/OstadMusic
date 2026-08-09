// components/auth-shell.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/logo-mark";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0908] text-[#f5f0e6]">
      {/* ========== Cinematic Background ========== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep multi-layer gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_75%_at_12%_8%,rgba(13,148,136,0.20),transparent),radial-gradient(ellipse_85%_65%_at_88%_92%,rgba(212,168,75,0.13),transparent),radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(20,184,166,0.04),transparent)]" />

        {/* Soft noise texture */}
        <div
          className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle music staff lines */}
        <div className="absolute inset-0 opacity-[0.022]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a84b] to-transparent"
              style={{ top: `${8 + i * 9.5}%` }}
            />
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="absolute -top-44 -left-44 w-[560px] h-[560px] rounded-full bg-[#0d9488]/22 blur-[150px] animate-pulse" />
        <div className="absolute -bottom-52 -right-36 w-[500px] h-[500px] rounded-full bg-[#d4a84b]/16 blur-[130px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#0d9488]/04 blur-[180px]" />
      </div>

      {/* ========== Content ========== */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left artistic panel – Violin / Piano / Guitar theme */}
        <div className="hidden lg:flex w-[46%] relative items-center justify-center p-14 xl:p-20">
          <div className="relative max-w-md text-center">
            {/* Large glowing logo */}
            <div className="relative mx-auto mb-14 w-36 h-36">
              <div className="absolute inset-0 rounded-[2.2rem] bg-gradient-to-br from-[#d4a84b]/30 to-[#0d9488]/22 blur-3xl scale-110" />
              <div className="relative flex items-center justify-center w-full h-full rounded-[2.2rem] bg-[#12100c]/80 border border-[#d4a84b]/22 shadow-[0_0_90px_rgba(212,168,75,0.16)] backdrop-blur-2xl">
                <LogoMark className="h-20 w-20" />
              </div>
            </div>

            <h2 className="font-display text-[2.05rem] xl:text-[2.3rem] font-bold tracking-tight mb-6 leading-snug">
              <span className="bg-gradient-to-l from-[#f5e6b8] via-[#d4a84b] to-[#f5e6b8] bg-clip-text text-transparent">
                همراه تو در مسیر موسیقی
              </span>
            </h2>

            <p className="text-[#b0a69a] leading-8 text-[15px] xl:text-[15.5px]">
              ویولن، پیانو و گیتار را با هزاران هنرجو و استاد در{" "}
              <span className="text-[#d4a84b] font-semibold">استاد موزیک</span>{" "}
              تجربه کن.
            </p>

            {/* Three instrument icons (abstract) */}
            <div className="mt-16 flex justify-center items-end gap-10 opacity-50">
              {/* Violin hint */}
              <div className="flex flex-col items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#d4a84b]">
                  <path d="M9 18c0-3 2-5 4-6 1-.5 2-1.5 2-3s-1-2.5-2-3c-2-1-4-3-4-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="13" cy="18" r="2.2" fill="currentColor"/>
                </svg>
                <span className="text-[11px] text-[#a89f8f]">ویولن</span>
              </div>
              {/* Piano hint */}
              <div className="flex flex-col items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#14b8a6]">
                  <rect x="4" y="6" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M8 6v12M12 6v12M16 6v12" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
                <span className="text-[11px] text-[#a89f8f]">پیانو</span>
              </div>
              {/* Guitar hint */}
              <div className="flex flex-col items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#d4a84b]">
                  <path d="M12 3v10M8 13c0 2.5 1.8 4.5 4 4.5s4-2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="12" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="text-[11px] text-[#a89f8f]">گیتار</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-14 sm:px-10 lg:px-16">
          <div className="w-full max-w-[400px]">
            {/* Brand link */}
            <Link
              href="/"
              className="flex items-center gap-3 mb-12 lg:mb-14 group"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-[#d4a84b]/18 blur-md group-hover:bg-[#d4a84b]/28 transition-all duration-300" />
                <LogoMark className="relative h-11 w-11" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-[#f5f0e6]">
                استاد موزیک
              </span>
            </Link>

            <h1 className="text-[1.75rem] sm:text-[1.85rem] font-bold tracking-tight mb-3 text-[#f5f0e6]">
              {title}
            </h1>
            <p className="text-[#a89f8f] text-[14.5px] leading-7 mb-10">
              {subtitle}
            </p>

            {children}

            {footer && (
              <div className="mt-10 text-center text-sm text-[#a89f8f]">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}