"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { TeacherCard } from "@/components/teacher-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTeachers } from "@/lib/api/teachers";
import type { TeacherListItem } from "@/lib/api/types";

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

/** تبدیل دیتای API به شکل مورد انتظار TeacherCard */
function toCardTeacher(t: TeacherListItem) {
  return {
    id: t.teacherProfileId,
    name: t.fullName,
    city: t.city,
    years: t.yearsOfExperience,
    rating: t.ratingAverage,
    reviews: t.ratingCount,
    price: Math.round(t.hourlyRate / 1000), // برای نمایش «هزار تومان»
    specialty: t.categories?.[0] ?? "",
    tags: t.categories ?? [],
    bio: t.bioShort,
    online: false,
    initials: getInitials(t.fullName),
    gradient: getGradient(t.teacherProfileId),
  };
}

export default function TeachersPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("همه شهرها");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sort, setSort] = useState("0");

  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const timer = setTimeout(load, 300); // debounce جست‌وجو
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, city, onlyVerified, sort]);

  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="فهرست اساتید"
        title="استادی که با تو هم‌سو باشد را پیدا کن"
        desc="استادان تاییدشده، از سبک کلاسیک تا فیوژن ایرانی، آماده‌ی همراهی تو در مسیر یادگیری."
      />

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1200px]">
          {/* Filters */}
          <div className="rounded-[20px] border border-line bg-surface p-5 mb-10 flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جست‌وجوی نام، سبک یا مهارت..."
                className="pr-11"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 rounded-xl border border-line bg-surface-2 px-4 text-sm text-ink focus-visible:outline-none focus-visible:border-gold/50"
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
                className="h-12 rounded-xl border border-line bg-surface-2 px-4 text-sm text-ink focus-visible:outline-none focus-visible:border-gold/50"
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
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                فقط تاییدشده
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
              در حال بارگذاری...
            </div>
          ) : error ? (
            <div className="text-center py-24 border border-dashed border-line rounded-[20px]">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <>
              <p className="text-muted text-sm mb-6">
                {totalCount.toLocaleString("fa-IR")} استاد پیدا شد
              </p>

              {teachers.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachers.map((t) => (
                    <TeacherCard key={t.teacherProfileId} teacher={toCardTeacher(t)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border border-dashed border-line rounded-[20px]">
                  <p className="text-muted">
                    استادی با این فیلترها پیدا نشد. کمی معیارها را تغییر بده.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}