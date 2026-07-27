"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";

function formatToman(n: number) {
  return n.toLocaleString("fa-IR");
}

export function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, totalPrice, totalCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300]">
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="بستن سبد خرید"
        onClick={closeCart}
      />
      <div className="absolute inset-y-0 start-0 w-full max-w-sm bg-bg-2 border-e border-line flex flex-col animate-[slideIn_0.3s_ease]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display font-bold text-lg">
            سبد خرید {totalCount > 0 && <span className="text-muted text-sm font-body">({totalCount.toLocaleString("fa-IR")} کالا)</span>}
          </h2>
          <button onClick={closeCart} aria-label="بستن">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted mb-4" />
            <p className="font-semibold mb-1.5">سبد خریدت خالی است</p>
            <p className="text-muted text-sm mb-6">محصولی از فروشگاه استاد موزیک اضافه کن.</p>
            <Button onClick={closeCart} asChild>
              <Link href="/shop">رفتن به فروشگاه</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 rounded-2xl border border-line bg-surface p-3">
                  <div
                    className="h-16 w-16 shrink-0 rounded-xl"
                    style={{ background: product.gradient }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{product.name}</div>
                    <div className="text-xs text-muted mt-0.5">{formatToman(product.price)} تومان</div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5 border border-line rounded-lg">
                        <button
                          className="p-1.5 text-muted hover:text-ink"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="کاهش تعداد"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs w-4 text-center">{qty.toLocaleString("fa-IR")}</span>
                        <button
                          className="p-1.5 text-muted hover:text-ink"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="افزایش تعداد"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="حذف از سبد"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line p-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">جمع کل</span>
                <span className="font-display font-bold text-base">{formatToman(totalPrice)} تومان</span>
              </div>
              <Button asChild size="lg" className="w-full" onClick={closeCart}>
                <Link href="/checkout">ادامه‌ی خرید</Link>
              </Button>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
