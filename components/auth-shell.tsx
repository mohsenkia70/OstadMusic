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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Decorative side */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#faf6ec] to-[#f0e8d4] items-center justify-center p-16">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 500px at 30% 20%, rgba(13,148,136,0.24), transparent 60%), radial-gradient(500px 400px at 80% 80%, rgba(124,147,255,0.14), transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(23,21,18,0.035) 0 2px, transparent 2px 26px)",
          }}
        />
        <div className="relative max-w-sm text-center">
          <LogoMark className="mx-auto mb-8 h-16 w-16 rounded-2xl shadow-[0_10px_40px_rgba(13,148,136,0.35)]" />
          <h2 className="font-display text-2xl font-bold mb-3 text-ink">همراه تو در مسیر ویولن</h2>
          <p className="text-muted leading-7">
            به جمع هزاران شاگرد و استادی بپیوند که هر روز، لحظه‌های موسیقی‌شان را در استاد موزیک می‌سازند.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold mb-10">
            <LogoMark className="h-8 w-8" />
            استاد موزیک
          </Link>

          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted text-sm mb-8">{subtitle}</p>

          {children}

          {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
