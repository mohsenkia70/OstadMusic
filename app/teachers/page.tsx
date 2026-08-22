"use client";

import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  Users,
  Sparkles,
  MapPin,
  Navigation,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { TeacherCard } from "@/components/teacher-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTeachers } from "@/lib/api/teachers";
import type { TeacherListItem } from "@/lib/api/types";
import { NearTeachersSearch } from "@/components/teachers/near-teachers-search";
import { cn } from "@/lib/utils";

const cities = ["همه شهرها", "تهران", "اصفهان", "شیراز", "تبریز"];
const sortOptions = [
  { value: "0", label: "بیشترین امتیاز" },
  { value: "1", label: "ارزان‌ترین" },
  { value: "2", label: "گران‌ترین" },
  { value: "3", label: "بیشترین سابقه" },
];

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

function getGradient(id: string) {
  const gradients = [
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  ];
  const index =
    id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    gradients.length;
  return gradients[index];
}

function toCardTeacher(t: TeacherListItem) {
  return {
    id: t.teacherProfileId,
    name: t.fullName,
    city: t.city,
    years: t.yearsOfExperience,
    rating: t.ratingAverage,
    reviews: t.ratingCount,
    price: Math.round(t.hourlyRate / 1000),
    specialty: t.categories?.[0] ?? "",
    tags: t.categories ?? [],
    bio: t.bioShort,
    online: false,
    initials: getInitials(t.fullName),
    gradient: getGradient(t.teacherProfileId),
  };
}

export default function TeachersPage() {
  const [mode, setMode] = useState<"normal" | "near">("normal");

  // حالت عادی
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("همه شهرها");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sort, setSort] = useState("0");

  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "normal") return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await getTeachers({
          search: query.trim() || undefined,
          city: city === "همه شهرها" ? undefined : city,
          onlyVerified: onlyVerified || undefined,
          sortBy: Number(sort),
          page: 1,
          pageSize: 50,
        });

        if (!cancelled) {
          setTeachers(res.items);
          setTotalCount(res.totalCount);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "خطا در دریافت لیست استادها"
          );
          setTeachers([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(load, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, city, onlyVerified, sort, mode]);

  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="فهرست اساتید"
        title="استادی که با تو هم‌سو باشد را پیدا کن"
        desc="استادان تاییدشده، از سبک کلاسیک تا فیوژن ایرانی، آماده‌ی همراهی تو در مسیر یادگیری."
      />

      <section className="px-6 pb-28 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* ─── سوییچ حالت عادی / نزدیک من ─── */}
          <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setMode("normal")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 h-12 rounded-2xl text-sm font-medium transition-all duration-300",
                mode === "normal"
                  ? "bg-gold text-[#1a160f] shadow-[0_6px_20px_rgba(212,168,75,0.25)]"
                  : "bg-surface border border-line/70 text-muted hover:text-ink hover:border-gold/30"
              )}
            >
              <Users className="h-4 w-4" />
              همه استادها
            </button>

            <button
              type="button"
              onClick={() => setMode("near")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 h-12 rounded-2xl text-sm font-medium transition-all duration-300",
                mode === "near"
                  ? "bg-gold text-[#1a160f] shadow-[0_6px_20px_rgba(212,168,75,0.25)]"
                  : "bg-surface border border-line/70 text-muted hover:text-ink hover:border-gold/30"
              )}
            >
              <Navigation className="h-4 w-4" />
              استادهای نزدیک من
            </button>
          </div>

          {/* ─── حالت نزدیک من ─── */}
          {mode === "near" ? (
            <NearTeachersSearch />
          ) : (
            <>
              {/* Filters */}
              <div className="mb-10 overflow-hidden rounded-3xl border border-line/70 bg-surface/80 p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] backdrop-blur-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="جست‌وجوی نام، سبک یا مهارت..."
                      className="h-12 rounded-2xl border-line/60 bg-bg-2/60 pr-11 transition-all focus-visible:border-gold/40 focus-visible:ring-gold/20"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-12 rounded-2xl border border-line/60 bg-bg-2/60 px-4 text-sm text-ink transition-all focus-visible:border-gold/40 focus-visible:outline-none"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="h-12 rounded-2xl border border-line/60 bg-bg-2/60 px-4 text-sm text-ink transition-all focus-visible:border-gold/40 focus-visible:outline-none"
                    >
                      {sortOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    <Button
                      variant={onlyVerified ? "gold" : "outline"}
                      size="default"
                      onClick={() => setOnlyVerified((v) => !v)}
                      className="h-12 gap-2 rounded-2xl px-5"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      فقط تاییدشده
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-32">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
                    <Loader2 className="relative h-8 w-8 animate-spin text-gold" />
                  </div>
                  <p className="text-sm text-muted">
                    در حال پیدا کردن بهترین استادها...
                  </p>
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-dashed border-red-200 bg-red-50/50 py-24 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-soft">
                        <Users className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {totalCount.toLocaleString("fa-IR")} استاد پیدا شد
                        </p>
                        <p className="text-xs text-muted">
                          بر اساس فیلترهای انتخابی شما
                        </p>
                      </div>
                    </div>
                  </div>

                  {teachers.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {teachers.map((t, i) => (
                        <div
                          key={t.teacherProfileId}
                          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                          style={{ animationDelay: `${(i % 6) * 60}ms` }}
                        >
                          <TeacherCard teacher={toCardTeacher(t)} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-line bg-surface/50 py-28 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-2">
                        <Sparkles className="h-7 w-7 text-muted" />
                      </div>
                      <p className="mb-1 font-medium text-ink">استادی پیدا نشد</p>
                      <p className="text-sm text-muted">
                        کمی معیارها را تغییر بده یا جست‌وجوی گسترده‌تری انجام بده.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}