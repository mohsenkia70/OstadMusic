import Link from "next/link";
import { AtSign, Send, PlayCircle, Heart } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";

const columns = [
  {
    title: "پلتفرم",
    links: [
      { href: "/about", label: "درباره ما" },
      { href: "/contact", label: "تماس با ما" },
      { href: "/blog", label: "وبلاگ" },
      { href: "/faq", label: "سوالات متداول" },
    ],
  },
  {
    title: "برای هنرجوان",
    links: [
      { href: "/teachers", label: "پیدا کردن استاد" },
      { href: "/shop", label: "فروشگاه استاد موزیک" },
      { href: "/#how", label: "چگونه کار می‌کند" },
      { href: "/signup", label: "ساخت حساب" },
    ],
  },
  {
    title: "برای اساتید",
    links: [
      { href: "/signup", label: "عضویت به‌عنوان استاد" },
      { href: "/faq", label: "راهنمای تدریس" },
      { href: "/contact", label: "سوالات اساتید" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-bg-2">
      {/* Soft ambient glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(13,148,136,0.15), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 pt-20 pb-10 md:px-8">
        {/* Top section */}
        <div className="mb-16 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-ink transition-opacity hover:opacity-80"
            >
              <LogoMark className="h-8 w-8" />
              استاد موزیک
            </Link>

            <p className="mb-6 max-w-[280px] text-sm leading-7 text-muted">
              پلتفرمی برای وصل‌شدن هنرجوان و اساتید ویولن در سراسر ایران؛ با اعتماد،
              شفافیت و عشق به موسیقی.
            </p>

            {/* Social */}
            <div className="flex gap-2.5">
              {[
                { Icon: AtSign, label: "اینستاگرام" },
                { Icon: Send, label: "تلگرام" },
                { Icon: PlayCircle, label: "یوتیوب" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-line/70 bg-surface/60 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold-soft hover:text-gold hover:shadow-[0_8px_20px_-8px_rgba(13,148,136,0.35)]"
                >
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="mb-5 text-xs font-semibold tracking-widest text-muted uppercase">
                {col.title}
              </h5>
              <ul className="flex flex-col gap-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group relative inline-block text-sm text-ink/80 transition-colors duration-300 hover:text-gold"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 right-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © ۱۴۰۴ استاد موزیک. تمامی حقوق محفوظ است.
          </p>

            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-ink transition-opacity hover:opacity-80"
            >
              <LogoMark className="h-8 w-8" />
              استاد موزیک
            </Link>
        </div>
      </div>
    </footer>
  );
}