import Link from "next/link";
import { Star } from "lucide-react";
import type { Teacher } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Link
      href={`/teachers/${teacher.id}`}
      className="group block rounded-[20px] border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/35 hover:bg-surface-2"
    >
      <div className="flex items-center gap-3.5 mb-5">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display font-bold text-[#181209]"
          style={{ background: teacher.gradient }}
        >
          {teacher.initials}
        </div>
        <div>
          <div className="font-bold">{teacher.name}</div>
          <div className="text-muted text-xs mt-0.5">
            {teacher.city} &middot; {teacher.years.toLocaleString("fa-IR")} سال سابقه
          </div>
        </div>
      </div>

      <p className="text-gold text-sm mb-4">{teacher.specialty}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {teacher.tags.map((tag) => (
          <Badge key={tag} variant="neutral">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-line text-sm">
        <div className="flex items-center gap-1.5 text-gold">
          <Star className="h-3.5 w-3.5 fill-gold" />
          <span>{teacher.rating.toLocaleString("fa-IR")}</span>
          <span className="text-muted">({teacher.reviews.toLocaleString("fa-IR")})</span>
        </div>
        <div className="text-muted">
          هر جلسه از <b className="text-ink font-bold">{teacher.price.toLocaleString("fa-IR")}</b> هزار تومان
        </div>
      </div>
    </Link>
  );
}
