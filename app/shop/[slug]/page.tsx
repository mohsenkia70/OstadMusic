import { notFound } from "next/navigation";
import { Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shop/product-card";
import { AddToCartBox } from "@/components/shop/add-to-cart-box";
import { products, getProductBySlug } from "@/lib/shop-data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

function formatToman(n: number) {
  return n.toLocaleString("fa-IR");
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <Navbar />

      <section className="px-6 md:px-8 pt-32 pb-20">
        <div className="mx-auto max-w-[1200px] grid lg:grid-cols-2 gap-12">
          <div className="relative aspect-square rounded-[24px] overflow-hidden" style={{ background: product.gradient }}>
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.28), transparent 55%)",
              }}
            />
            {product.badge && (
              <Badge variant="gold" className="absolute top-5 start-5">
                {product.badge}
              </Badge>
            )}
          </div>

          <div>
            <div className="text-sm text-gold mb-2">{product.category}</div>
            <h1 className="text-2xl md:text-3xl mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="flex items-center gap-1.5 text-gold">
                <Star className="h-4 w-4 fill-gold" /> {product.rating.toLocaleString("fa-IR")}
                <span className="text-muted">({product.reviews.toLocaleString("fa-IR")} نظر)</span>
              </span>
              <span className="text-muted">
                {product.stock > 5 ? "موجود در انبار" : `تنها ${product.stock.toLocaleString("fa-IR")} عدد باقی‌مانده`}
              </span>
            </div>

            <p className="text-muted leading-8 mb-6">{product.description}</p>

            <div className="flex items-baseline gap-3 mb-7">
              {product.oldPrice && (
                <span className="text-muted line-through text-sm">{formatToman(product.oldPrice)} تومان</span>
              )}
              <span className="font-display text-2xl font-bold">{formatToman(product.price)} تومان</span>
            </div>

            <AddToCartBox productId={product.id} stock={product.stock} />

            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              <div className="flex items-center gap-2.5 text-xs text-muted rounded-xl border border-line p-3.5">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" /> ضمانت اصالت کالا
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted rounded-xl border border-line p-3.5">
                <Truck className="h-4 w-4 text-gold shrink-0" /> ارسال به سراسر ایران
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted rounded-xl border border-line p-3.5">
                <RotateCcw className="h-4 w-4 text-gold shrink-0" /> ۷ روز مهلت بازگشت
              </div>
            </div>

            <div className="mt-9 rounded-2xl border border-line bg-surface p-6">
              <h2 className="font-bold mb-4 text-sm">مشخصات فنی</h2>
              <div className="space-y-3">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between text-sm border-b border-line pb-3 last:border-0 last:pb-0">
                    <span className="text-muted">{s.label}</span>
                    <span>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 md:px-8 pb-28">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-xl font-bold mb-6">محصولات مرتبط</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
