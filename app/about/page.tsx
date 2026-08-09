import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";

const values = [
  {
    title: "اعتماد اول",
    desc: "هر استاد پیش از پذیرش، از فیلتر بررسی سابقه و مصاحبه عبور می‌کند.",
  },
  {
    title: "شفافیت در همه‌چیز",
    desc: "قیمت، سطح و سبک تدریس هر استاد پیش از رزرو، شفاف و روشن است.",
  },
  {
    title: "احترام به مسیر هر نفر",
    desc: "هیچ دو هنرجوی مثل هم یاد نمی‌گیرند؛ استاد موزیک فضایی برای مسیر شخصی هرکس فراهم می‌کند.",
  },
];

const timeline = [
  { year: "۱۴۰۱", text: "ایده‌ی استاد موزیک از یک جست‌وجوی سخت برای پیدا کردن استاد ویولن متولد شد." },
  { year: "۱۴۰۲", text: "اولین نسخه‌ی استاد موزیک با ۴۰ استاد در تهران راه‌اندازی شد." },
  { year: "۱۴۰۳", text: "استاد موزیک به ۳۱ شهر ایران و کلاس‌های آنلاین گسترش پیدا کرد." },
  { year: "۱۴۰۴", text: "بیش از ۴۸۰ استاد و ۱۲ هزار ساعت آموزش برگزارشده روی پلتفرم." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="درباره استاد موزیک"
        title="ما اینجاییم تا صدای درون تو را پیدا کنیم"
        desc="استاد موزیک از یک باور ساده شروع شد: یادگیری ویولن باید با استاد درست، نه با شانس، شکل بگیرد."
      />

      <section className="px-6 md:px-8 pb-24">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-muted leading-8 text-lg">
            بنیان‌گذاران استاد موزیک، خودشان سال‌ها برای پیدا کردن استاد مناسب ویولن دست‌وپنجه نرم کرده
            بودند. از این تجربه، پلتفرمی ساخته شد که بررسی سابقه، شفافیت قیمت و امکان کلاس آزمایشی
            رایگان را در اولویت قرار می‌دهد — تا هیچ‌کس مجبور نباشد فقط با حدس، استاد آینده‌اش را
            انتخاب کند.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-24">
        <div className="mx-auto max-w-[1200px] grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="rounded-[20px] border border-line bg-surface p-8">
              <h3 className="font-bold text-lg mb-3">{v.title}</h3>
              <p className="text-muted text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-2xl md:text-3xl text-center mb-14">مسیر استاد موزیک تا امروز</h2>
          <div className="relative border-e-2 border-line pe-8 space-y-12">
            {timeline.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -end-[41px] top-0 flex h-4 w-4 rounded-full bg-gold ring-4 ring-bg" />
                <span className="block text-gold font-display font-bold mb-1.5">{item.year}</span>
                <p className="text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
