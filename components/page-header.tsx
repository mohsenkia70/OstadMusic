export function PageHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="relative pt-40 pb-16 md:pt-48 md:pb-20 text-center px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(500px 320px at 50% 0%, rgba(13,148,136,0.18), transparent 70%)",
        }}
      />
      <div className="relative max-w-2xl mx-auto">
        <span className="inline-block text-gold text-sm font-semibold bg-gold-soft border border-gold/30 rounded-full px-4 py-1.5 mb-6">
          {eyebrow}
        </span>
        <h1 className="text-3xl md:text-5xl mb-4">{title}</h1>
        {desc && <p className="text-muted text-base md:text-lg">{desc}</p>}
      </div>
    </div>
  );
}
