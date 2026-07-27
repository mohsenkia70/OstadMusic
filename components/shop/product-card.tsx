"use client";

import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/shop-data";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-provider";

function formatToman(n: number) {
  return n.toLocaleString("fa-IR");
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group rounded-[20px] border border-line bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/35">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square" style={{ background: product.gradient }}>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25), transparent 55%)",
            }}
          />
          {product.badge && (
            <Badge variant="gold" className="absolute top-3 start-3">
              {product.badge}
            </Badge>
          )}
          {product.stock <= 5 && (
            <Badge variant="warning" className="absolute top-3 end-3">
              {product.stock.toLocaleString("fa-IR")} عدد باقی‌مانده
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/shop/${product.slug}`}>
          <div className="text-xs text-muted mb-1.5">{product.category}</div>
          <h3 className="font-semibold text-sm mb-2 group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-gold mb-3">
          <Star className="h-3.5 w-3.5 fill-gold" />
          {product.rating.toLocaleString("fa-IR")}
          <span className="text-muted">({product.reviews.toLocaleString("fa-IR")})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.oldPrice && (
              <div className="text-xs text-muted line-through">{formatToman(product.oldPrice)}</div>
            )}
            <div className="font-display font-bold text-sm">{formatToman(product.price)} تومان</div>
          </div>
          <button
            onClick={() => addItem(product.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-soft text-gold hover:bg-gold hover:text-[#181209] transition-colors"
            aria-label="افزودن به سبد خرید"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
