import Link from "next/link";
import { AtSign, Send, PlayCircle } from "lucide-react";
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
    title: "برای شاگردان",
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
    <footer className="border-t border-line bg-bg-2 pt-20 pb-8">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 mb-16">
          <div>
            <div className="flex items-center gap-2.5 font-display text-xl font-extrabold mb-4">
              <LogoMark className="h-8 w-8" />
              استاد موزیک
            </div>
            <p className="text-muted text-sm max-w-[280px] mb-5">
              پلتفرمی برای وصل‌شدن شاگردان و اساتید ویولن در سراسر ایران؛ با اعتماد، شفافیت و عشق به موسیقی.
            </p>
            <div className="flex gap-2.5">
              {[AtSign, Send, PlayCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:text-gold hover:border-gold/40"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="text-sm font-semibold text-muted mb-5 tracking-wide">{col.title}</h5>
              <ul className="flex flex-col gap-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-ink/85 hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3 pt-7 border-t border-line text-muted text-sm">
          <span>© ۱۴۰۴ استاد موزیک. تمامی حقوق محفوظ است.</span>
          <span>ساخته‌شده با ❤ برای موسیقی ایران</span>
        </div>
      </div>
    </footer>
  );
}
