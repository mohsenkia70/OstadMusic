"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function AddToCartBox({ productId, stock }: { productId: string; stock: number }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(productId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-3 border border-line rounded-xl px-3 py-1 self-start">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="p-2 text-muted hover:text-ink"
          aria-label="کاهش تعداد"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-sm">{qty.toLocaleString("fa-IR")}</span>
        <button
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          className="p-2 text-muted hover:text-ink"
          aria-label="افزایش تعداد"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button size="lg" className="flex-1 gap-2" onClick={handleAdd}>
        {added ? (
          <>
            <Check className="h-4 w-4" /> به سبد اضافه شد
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" /> افزودن به سبد خرید
          </>
        )}
      </Button>
    </div>
  );
}
