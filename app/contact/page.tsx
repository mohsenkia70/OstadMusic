"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const info = [
  { icon: Mail, title: "ایمیل", value: "hello@ostadmusic.app" },
  { icon: Phone, title: "تلفن پشتیبانی", value: "۰۲۱-۹۱۰۰۰۰۰۰" },
  { icon: MapPin, title: "دفتر مرکزی", value: "تهران، خیابان کریمخان" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>();

  const onSubmit = () => {
    setSubmitted(true);
    reset();
  };

  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="تماس با ما"
        title="سوالی داری؟ برایمان بنویس"
        desc="تیم استاد موزیک معمولا در کمتر از یک روز کاری پاسخ می‌دهد."
      />

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1000px] grid md:grid-cols-[1fr_1.3fr] gap-10">
          <div className="space-y-5">
            {info.map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-surface p-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted mb-1">{item.title}</div>
                  <div className="font-semibold">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[20px] border border-line bg-surface p-8">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-14">
                <CheckCircle2 className="h-12 w-12 text-gold mb-5" />
                <h3 className="text-lg font-bold mb-2">پیامت ارسال شد</h3>
                <p className="text-muted text-sm">به‌زودی از طریق ایمیل پاسخت را می‌دهیم.</p>
                <Button variant="glass" className="mt-7" onClick={() => setSubmitted(false)}>
                  ارسال پیام دیگر
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">نام و نام‌خانوادگی</Label>
                    <Input id="name" placeholder="مثلا سارا جعفری" {...register("name", { required: true })} />
                    {errors.name && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">ایمیل</Label>
                    <Input id="email" type="email" placeholder="you@email.com" {...register("email", { required: true })} />
                    {errors.email && <p className="text-xs text-red-600 mt-1.5">ایمیل معتبر وارد کن</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">موضوع</Label>
                  <Input id="subject" placeholder="مثلا سوال درباره‌ی رزرو کلاس" {...register("subject", { required: true })} />
                </div>
                <div>
                  <Label htmlFor="message">پیام</Label>
                  <Textarea id="message" placeholder="پیامت را اینجا بنویس..." {...register("message", { required: true })} />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  ارسال پیام
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
