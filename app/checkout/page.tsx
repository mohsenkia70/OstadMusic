"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

type ShippingForm = {
  fullName: string;
  phone: string;
  city: string;
  postalCode: string;
  address: string;
};

function formatToman(n: number) {
  return n.toLocaleString("fa-IR");
}

const SHIPPING_COST = 250;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>();

  const onSubmit = () => {
    router.push("/checkout/payment");
  };

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="تسویه‌حساب" title="اطلاعات ارسال را تکمیل کن" />

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1100px]">
          {items.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-line rounded-[20px]">
              <p className="text-muted mb-6">سبد خریدت خالی است. برای ادامه، ابتدا محصولی اضافه کن.</p>
              <Button asChild>
                <Link href="/shop">رفتن به فروشگاه</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">
              <form onSubmit={handleSubmit(onSubmit)} className="rounded-[20px] border border-line bg-surface p-7 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="fullName">نام و نام‌خانوادگی گیرنده</Label>
                    <Input id="fullName" placeholder="مثلا مهسا رستمی" {...register("fullName", { required: true })} />
                    {errors.fullName && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">شماره موبایل</Label>
                    <Input id="phone" dir="ltr" className="text-left" placeholder="۰۹۱۲۳۴۵۶۷۸۹" {...register("phone", { required: true })} />
                    {errors.phone && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="city">شهر</Label>
                    <Input id="city" placeholder="مثلا اصفهان" {...register("city", { required: true })} />
                    {errors.city && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">کد پستی</Label>
                    <Input id="postalCode" dir="ltr" className="text-left" placeholder="۱۲۳۴۵۶۷۸۹۰" {...register("postalCode", { required: true })} />
                    {errors.postalCode && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">آدرس کامل</Label>
                  <Textarea id="address" placeholder="خیابان، کوچه، پلاک، واحد..." {...register("address", { required: true })} />
                  {errors.address && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
                </div>

                <Button type="submit" size="lg" className="w-full">
                  ادامه به درگاه پرداخت
                </Button>
              </form>

              <div className="rounded-[20px] border border-line bg-surface p-7 h-fit lg:sticky lg:top-28">
                <h2 className="font-bold mb-6">خلاصه‌ی سفارش</h2>
                <div className="space-y-3 mb-5">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="text-muted truncate ml-3">
                        {product.name} × {qty.toLocaleString("fa-IR")}
                      </span>
                      <span className="shrink-0">{formatToman(product.price * qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5 text-sm pt-4 border-t border-line mb-5">
                  <div className="flex justify-between">
                    <span className="text-muted">جمع کالاها</span>
                    <span>{formatToman(totalPrice)} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">هزینه‌ی ارسال</span>
                    <span>{formatToman(shipping)} تومان</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-line mb-6">
                  <span className="text-muted text-sm">مبلغ قابل پرداخت</span>
                  <span className="font-display font-bold text-lg">
                    {formatToman(totalPrice + shipping)} تومان
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                  پرداخت از طریق درگاه امن انجام می‌شود.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
