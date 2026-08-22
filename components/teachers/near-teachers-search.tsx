"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Navigation,
  Loader2,
  Search,
  AlertCircle,
  Star,
  List,
  Map as MapIcon,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getTeachers } from "@/lib/api/teachers";
import type { TeacherListItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

// نقشه رو فقط سمت کلاینت لود میکنیم
const NearTeachersMap = dynamic(
  () =>
    import("@/components/teachers/near-teachers-map").then(
      (m) => m.NearTeachersMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[420px] rounded-2xl bg-bg-2 border border-line flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-gold" />
      </div>
    ),
  }
);

export function NearTeachersSearch() {
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searched, setSearched] = useState(false);
  const [view, setView] = useState<"split" | "map" | "list">("split");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // تشخیص موبایل
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1024) setView("list");
      else setView("split");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // دریافت موقعیت کاربر
  const getCurrentLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          let msg = "خطا در دریافت موقعیت.";
          if (err.code === 1) {
            msg = "دسترسی به موقعیت مکانی رد شد. لطفاً از تنظیمات مرورگر اجازه دهید.";
          } else if (err.code === 2) {
            msg = "موقعیت قابل تعیین نیست.";
          } else if (err.code === 3) {
            msg = "زمان درخواست موقعیت به پایان رسید.";
          }
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });
  }, []);

  // جستجوی استادهای نزدیک
  const searchNear = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getTeachers({
          latitude: lat,
          longitude: lng,
          radiusKm: 20,
          sortBy: "NearestFirst",
          pageSize: 100,
        });

        console.log(`📊 ${res.items?.length ?? 0} استاد پیدا شد`);
        
        const withCoords = res.items?.filter(
          (t) => t.latitude != null && t.longitude != null
        ) ?? [];
        
        console.log(`📍 ${withCoords.length} استاد دارای مختصات`);

        setTeachers(res.items ?? []);
        setSearched(true);
        setFocusedId(null);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "خطا در جستجوی استادها";
        setError(message);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // هندل کلیک روی دکمه موقعیت
  const handleUseMyLocation = async () => {
    setIsGettingLocation(true);
    setError(null);
    
    try {
      const coords = await getCurrentLocation();
      setUserCoords(coords);
      await searchNear(coords.lat, coords.lng);
      toast.success("موقعیت شما دریافت شد و استادهای نزدیک پیدا شدند ✅");
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطا در دریافت موقعیت";
      setError(message);
      toast.error(message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const hasCoords = userCoords !== null;

  // استادهایی که روی نقشه نمایش داده میشن
  const teachersWithCoords = teachers.filter(
    (t) => t.latitude != null && t.longitude != null
  );

  const isLoading = loading || isGettingLocation;

  return (
    <div className="space-y-5">
      {/* ─── کنترل‌ها ─── */}
      <div className="rounded-3xl border border-line/70 bg-surface/90 p-5 md:p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
              <MapPin className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">
                استادهای نزدیک من
              </h2>
              <p className="text-xs text-muted mt-0.5">
                نزدیک‌ترین اساتید را روی نقشه تهران ببینید
              </p>
            </div>
          </div>

          <Button
            onClick={handleUseMyLocation}
            disabled={isLoading}
            size="lg"
            className="gap-2 h-12 px-6 rounded-2xl bg-gradient-to-l from-[#d4a84b] via-[#e0b85c] to-[#d4a84b] text-[#1a160f] font-semibold hover:brightness-110 shadow-[0_6px_24px_rgba(212,168,75,0.25)] shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isGettingLocation ? "دریافت موقعیت..." : "در حال جستجو..."}
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4" />
                {hasCoords ? "به‌روزرسانی موقعیت" : "استفاده از موقعیت من"}
              </>
            )}
          </Button>
        </div>

        {/* سوییچ نما */}
        {hasCoords && searched && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-2 border border-line/50">
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  view === "list"
                    ? "bg-surface text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                )}
              >
                <List className="h-3.5 w-3.5" />
                لیست
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  view === "map"
                    ? "bg-surface text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                )}
              >
                <MapIcon className="h-3.5 w-3.5" />
                نقشه
              </button>
              <button
                type="button"
                onClick={() => setView("split")}
                className={cn(
                  "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  view === "split"
                    ? "bg-surface text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                )}
              >
                هر دو
              </button>
            </div>

            <p className="text-xs text-muted">
              {teachersWithCoords.length} استاد روی نقشه
            </p>
          </div>
        )}
      </div>

      {/* خطا */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">مشکل در دریافت موقعیت یا داده‌ها</p>
            <p className="text-xs mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* محتوا بعد از جستجو */}
      {searched && hasCoords && (
        <div
          className={cn(
            "grid gap-5",
            view === "split" ? "lg:grid-cols-[1fr_400px]" : "grid-cols-1"
          )}
        >
          {/* نقشه */}
          {(view === "map" || view === "split") && (
            <div className="order-1 lg:order-none h-[450px] lg:h-[550px]">
              <NearTeachersMap
                userLat={userCoords.lat}
                userLng={userCoords.lng}
                teachers={teachers}
                focusedTeacherId={focusedId}
                onMarkerClick={(id) => {
                  setFocusedId(id);
                  if (view === "list") {
                    setView("map");
                  }
                }}
              />
            </div>
          )}

          {/* لیست */}
          {(view === "list" || view === "split") && (
            <div className="order-2 lg:order-none space-y-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-gold" />
                  <p className="text-sm text-muted">در حال بارگذاری استادها...</p>
                </div>
              ) : teachers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface/40 py-16 text-center">
                  <Search className="h-9 w-9 text-muted mx-auto mb-3 opacity-40" />
                  <p className="text-sm text-muted">
                    استادی نزدیک شما پیدا نشد
                  </p>
                  <p className="text-xs text-muted mt-2">
                    دکمه "به‌روزرسانی موقعیت" رو بزنید یا موقعیت خود را تغییر دهید
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted px-1 mb-1">
                    {teachers.length} استاد نزدیک شما
                  </p>

                  {teachers.map((t) => (
                    <button
                      key={t.teacherProfileId}
                      type="button"
                      onClick={() => {
                        setFocusedId(t.teacherProfileId);
                        if (t.latitude != null && t.longitude != null && view === "list") {
                          setView("map");
                        }
                      }}
                      className={cn(
                        "w-full text-right rounded-2xl border p-4 transition-all duration-200",
                        focusedId === t.teacherProfileId
                          ? "border-gold/50 bg-gold/5 shadow-[0_0_0_1px_rgba(212,168,75,0.2)]"
                          : "border-line/60 bg-surface hover:border-gold/30 hover:bg-surface/80"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* عکس کوچک */}
                        <div className="relative shrink-0">
                          {t.profileImage ? (
                            <img
                              src={t.profileImage}
                              alt={t.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-gold/20"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          {!t.profileImage && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                              {t.fullName.charAt(0)}
                            </div>
                          )}
                          {t.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-0.5 border-2 border-surface">
                              <ShieldCheck className="w-3 h-3 text-[#1a160f]" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[14px] truncate">
                              {t.fullName}
                            </h3>
                          </div>
                          <p className="text-xs text-muted mt-0.5 truncate">
                            {t.city}
                            {t.district ? ` · ${t.district}` : ""}
                            {t.distanceKm != null && (
                              <span className="text-gold/80">
                                {" "}
                                · {t.distanceKm.toFixed(1)} کیلومتر
                              </span>
                            )}
                          </p>
                          {t.bioShort && (
                            <p className="text-xs text-muted/60 mt-1 line-clamp-1">
                              {t.bioShort}
                            </p>
                          )}
                        </div>

                        <div className="text-left shrink-0">
                          <p className="text-sm font-semibold text-gold">
                            {t.hourlyRate.toLocaleString("fa-IR")}
                          </p>
                          <p className="text-[10px] text-muted">تومان</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-line/40">
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-gold text-gold" />
                            <span>
                              {t.ratingCount > 0
                                ? `${t.ratingAverage.toFixed(1)} (${t.ratingCount})`
                                : "بدون امتیاز"}
                            </span>
                          </div>
                          {t.yearsOfExperience > 0 && (
                            <span>• {t.yearsOfExperience} سال تجربه</span>
                          )}
                          {!t.latitude && (
                            <span className="text-amber-500/70 text-[10px]">
                              ⚠️ بدون موقعیت
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/teachers/${t.teacherProfileId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-medium text-gold hover:underline"
                        >
                          مشاهده پروفایل
                        </Link>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* حالت اولیه قبل از جستجو */}
      {!searched && !isLoading && (
        <div className="rounded-3xl border border-dashed border-line/60 bg-surface/30 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <Navigation className="h-7 w-7 text-gold" />
          </div>
          <p className="font-medium text-ink mb-1">موقعیت خود را مشخص کنید</p>
          <p className="text-sm text-muted max-w-sm mx-auto">
            با یک کلیک نزدیک‌ترین استادهای تأییدشده را روی نقشه تهران ببینید
          </p>
          <Button
            onClick={handleUseMyLocation}
            disabled={isLoading}
            className="mt-4 gap-2 bg-gold text-[#1a160f] hover:brightness-110"
          >
            <Navigation className="h-4 w-4" />
            دریافت موقعیت من
          </Button>
        </div>
      )}
    </div>
  );
}