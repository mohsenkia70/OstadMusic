"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { TeacherCard } from "@/components/teacher-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { teachers } from "@/lib/data";

const cities = ["همه شهرها", "تهران", "اصفهان", "شیراز", "تبریز", "آنلاین"];
const sortOptions = [
  { value: "rating", label: "بیشترین امتیاز" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "experience", label: "بیشترین سابقه" },
];

export default function TeachersPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("همه شهرها");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sort, setSort] = useState("rating");

  const filtered = useMemo(() => {
    let list = teachers.filter((t) => {
      const matchesQuery =
        query.trim().length === 0 ||
        t.name.includes(query) ||
        t.specialty.includes(query) ||
        t.tags.some((tag) => tag.includes(query));
      const matchesCity = city === "همه شهرها" || t.city === city;
      const matchesOnline = !onlineOnly || t.online;
      return matchesQuery && matchesCity && matchesOnline;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "experience") return b.years - a.years;
      return 0;
    });

    return list;
  }, [query, city, onlineOnly, sort]);

  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="فهرست اساتید"
        title="استادی که با تو هم‌سو باشد را پیدا کن"
        desc="بیش از ۴۸۰ استاد تاییدشده، از سبک کلاسیک تا فیوژن ایرانی، آماده‌ی همراهی تو در مسیر یادگیری."
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
                variant={onlineOnly ? "gold" : "outline"}
                size="default"
                onClick={() => setOnlineOnly((v) => !v)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                فقط آنلاین
              </Button>
            </div>
          </div>

          <p className="text-muted text-sm mb-6">
            {filtered.length.toLocaleString("fa-IR")} استاد پیدا شد
          </p>

          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <TeacherCard key={t.id} teacher={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-line rounded-[20px]">
              <p className="text-muted">استادی با این فیلترها پیدا نشد. کمی معیارها را تغییر بده.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
