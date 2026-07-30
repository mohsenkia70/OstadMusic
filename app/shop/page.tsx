"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/shop/product-card";
import { Input } from "@/components/ui/input";
import { categories, products } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "popular", label: "محبوب‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "rating", label: "بیشترین امتیاز" },
];

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesQuery = query.trim().length === 0 || p.name.includes(query) || p.category.includes(query);
      const matchesCategory = category === "همه" || p.category === category;
      return matchesQuery && matchesCategory;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

    return list;
  }, [query, category, sort]);

  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="فروشگاه استاد موزیک"
        title="ساز و لوازم جانبی، انتخاب‌شده برای نوازنده‌ها"
        desc="از ویولن و کمان حرفه‌ای تا سیم، رزین و نت؛ همه با ضمانت اصالت کالا."
      />

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-[20px] border border-line bg-surface p-5 mb-10 flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جست‌وجوی محصول..."
                className="pr-11"
              />
            </div>
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
          </div>

          <div className="flex flex-wrap gap-2.5 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  category === c
                    ? "border-gold/40 bg-gold-soft text-gold"
                    : "border-line text-muted hover:text-ink"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="text-muted text-sm mb-6">{filtered.length.toLocaleString("fa-IR")} محصول پیدا شد</p>

          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-line rounded-[20px]">
              <p className="text-muted">محصولی با این فیلترها پیدا نشد.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
