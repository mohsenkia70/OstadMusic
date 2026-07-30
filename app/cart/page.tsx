"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

function formatToman(n: number) {
  return n.toLocaleString("fa-IR");
}

const SHIPPING_COST = 250;

export default function CartPage() {
  const { items, setQty, removeItem, totalPrice, totalCount } = useCart();
  const shipping = items.length > 0 ? SHIPPING_COST : 0;

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="سبد خرید" title="سبد خرید تو" />

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1100px]">
          {items.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-line rounded-[20px]">
              <ShoppingBag className="h-10 w-10 text-muted mx-auto mb-4" />
              <p className="font-semibold mb-1.5">سبد خریدت خالی است</p>
              <p className="text-muted text-sm mb-7">هنوز محصولی اضافه نکرده‌ای.</p>
              <Button asChild>
                <Link href="/shop">رفتن به فروشگاه</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-4">
                {items.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-line bg-surface p-5"
                  >
                    <div className="h-20 w-20 shrink-0 rounded-xl" style={{ background: product.gradient }} />
                    <div className="flex-1">
                      <Link href={`/shop/${product.slug}`} className="font-semibold text-sm hover:text-gold">
                        {product.name}
                      </Link>
                      <div className="text-xs text-muted mt-1">{product.category}</div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 border border-line rounded-lg">
                          <button
                            className="p-2 text-muted hover:text-ink"
                            onClick={() => setQty(product.id, qty - 1)}
                            aria-label="کاهش تعداد"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm w-5 text-center">{qty.toLocaleString("fa-IR")}</span>
                          <button
                            className="p-2 text-muted hover:text-ink"
                            onClick={() => setQty(product.id, qty + 1)}
                            aria-label="افزایش تعداد"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-sm">
                            {formatToman(product.price * qty)} تومان
                          </span>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="حذف از سبد"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[20px] border border-line bg-surface p-7 h-fit lg:sticky lg:top-28">
                <h2 className="font-bold mb-6">خلاصه‌ی سفارش</h2>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between">
                    <span className="text-muted">تعداد کالا</span>
                    <span>{totalCount.toLocaleString("fa-IR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">جمع کالاها</span>
                    <span>{formatToman(totalPrice)} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">هزینه‌ی ارسال</span>
                    <span>{formatToman(shipping)} تومان</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-line mb-7">
                  <span className="text-muted text-sm">مبلغ قابل پرداخت</span>
                  <span className="font-display font-bold text-lg">
                    {formatToman(totalPrice + shipping)} تومان
                  </span>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">ادامه‌ی فرآیند خرید</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
