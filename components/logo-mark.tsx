import { cn } from "@/lib/utils";

/**
 * استاد موزیک — brand mark: a clean, geometric paired-eighth-notes glyph
 * inside the signature rounded-square badge. Used everywhere the old
 * violin-bow icon used to appear (navbar, footer, auth screens, dashboards).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-gold to-[#0f766e] shadow-[0_4px_18px_rgba(13,148,136,0.35)]",
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[55%] w-[55%]">
        <rect x="8.2" y="7" width="1.6" height="11" rx="0.8" fill="#181209" />
        <rect x="16.8" y="5" width="1.6" height="11" rx="0.8" fill="#181209" />
        <path d="M8.2 8.4 L8.2 7 L18.4 5 L18.4 6.4 Z" fill="#181209" />
        <circle cx="7.5" cy="18" r="2.3" fill="#181209" />
        <circle cx="16.1" cy="16" r="2.3" fill="#181209" />
      </svg>
    </span>
  );
}
