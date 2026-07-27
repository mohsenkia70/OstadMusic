import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <article className="px-6 md:px-8 pt-36 pb-28">
        <div className="mx-auto max-w-[760px]">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors mb-8">
            <ArrowRight className="h-4 w-4 rotate-180" /> بازگشت به وبلاگ
          </Link>

          <Badge variant="gold" className="mb-5">
            {post.category}
          </Badge>
          <h1 className="text-2xl md:text-4xl mb-5 leading-snug">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted mb-10 pb-10 border-b border-line">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </div>

          <div className="space-y-6">
            {post.content.map((para, i) => (
              <p key={i} className="text-ink/90 leading-8">
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
