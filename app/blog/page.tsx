import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/data";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="وبلاگ استاد موزیک"
        title="یادداشت‌هایی برای هم‌سفرهای مسیر ویولن"
        desc="تجربه‌ها، راهنماها و داستان‌هایی از دنیای آموزش ویولن."
      />

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1000px] grid md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-[20px] border border-line bg-surface overflow-hidden transition-all hover:-translate-y-1.5 hover:border-gold/35"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-[#f7f2e4] to-[#eee4cc] relative">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(13,148,136,0.3), transparent 60%)",
                  }}
                />
              </div>
              <div className="p-7">
                <Badge variant="gold" className="mb-4">
                  {post.category}
                </Badge>
                <h3 className="text-lg font-bold mb-2.5 group-hover:text-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted text-sm mb-5">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
