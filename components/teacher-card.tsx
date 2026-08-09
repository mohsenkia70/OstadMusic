import Link from "next/link";
import { Star, MapPin, Clock, ArrowUpLeft } from "lucide-react";
import type { Teacher } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Link
      href={`/teachers/${teacher.id}`}
      className="group relative block h-full overflow-hidden rounded-3xl border border-line/60 bg-surface transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold/40 hover:shadow-[0_25px_50px_-12px_rgba(13,148,136,0.18)]"
    >
      {/* Background gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${teacher.gradient}15 0%, transparent 60%)`,
        }}
      />

      {/* Shine effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[150%] group-hover:opacity-100" />
      </div>

      <div className="relative flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="relative">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold text-[#181209] shadow-inner transition-transform duration-500 group-hover:scale-105"
                style={{ background: teacher.gradient }}
              >
                {teacher.initials}
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface bg-emerald-500" />
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-ink transition-colors duration-300 group-hover:text-gold">
                {teacher.name}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3 w-3" />
                <span>{teacher.city}</span>
                <span className="mx-0.5">•</span>
                <Clock className="h-3 w-3" />
                <span>{teacher.years.toLocaleString("fa-IR")} سال</span>
              </div>
            </div>
          </div>

          {/* Rating badge */}
          <div className="flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-medium text-gold">
            <Star className="h-3 w-3 fill-gold" />
            <span>{teacher.rating.toLocaleString("fa-IR")}</span>
          </div>
        </div>

        {/* Specialty */}
        <p className="mb-4 text-sm font-medium text-gold/90">{teacher.specialty}</p>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {teacher.tags.map((tag) => (
            <Badge
              key={tag}
              variant="neutral"
              className="rounded-full border border-line/50 bg-bg-2/80 px-2.5 py-0.5 text-[11px] font-medium text-muted transition-colors duration-300 group-hover:border-gold/20 group-hover:bg-gold-soft/40 group-hover:text-ink"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-line/50 pt-4">
          <div className="text-sm text-muted">
            از{" "}
            <span className="font-bold text-ink">
              {teacher.price.toLocaleString("fa-IR")}
            </span>{" "}
            هزار تومان
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-muted transition-colors duration-300 group-hover:text-gold">
            <span>مشاهده پروفایل</span>
            <ArrowUpLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}