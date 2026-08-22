"use client";

import { useState, useCallback } from "react";
import {
  MapPin,
  Navigation,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMyTeacherLocation } from "@/lib/api/teachers";
import { cn } from "@/lib/utils";

type Props = {
  /** اگر از قبل موقعیت ثبت شده باشه (اختیاری) */
  initialLat?: number | null;
  initialLng?: number | null;
  className?: string;
};

type GeoState = "idle" | "locating" | "success" | "error" | "saving";

export function TeacherLocationSection({
  initialLat,
  initialLng,
  className,
}: Props) {
  const [lat, setLat] = useState<number | null>(initialLat ?? null);
  const [lng, setLng] = useState<number | null>(initialLng ?? null);
  const [address, setAddress] = useState<string | null>(null);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fa`,
        {
          headers: {
            "User-Agent": "OstadMusic/1.0 (contact@ostadmusic.ir)",
          },
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.display_name as string | null;
    } catch {
      return null;
    }
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
      setGeoState("error");
      return;
    }

    setGeoState("locating");
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setGeoState("success");

        const addr = await reverseGeocode(latitude, longitude);
        setAddress(addr);
      },
      (err) => {
        let msg = "خطا در دریافت موقعیت.";
        if (err.code === 1) msg = "دسترسی به موقعیت مکانی رد شد. لطفاً اجازه دهید.";
        if (err.code === 2) msg = "موقعیت قابل تعیین نیست.";
        if (err.code === 3) msg = "زمان درخواست موقعیت به پایان رسید.";
        setErrorMsg(msg);
        setGeoState("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [reverseGeocode]);

  const handleSave = async () => {
    if (lat == null || lng == null) {
      toast.error("ابتدا موقعیت را مشخص کنید.");
      return;
    }

    setGeoState("saving");
    try {
      await updateMyTeacherLocation({ latitude: lat, longitude: lng });
      toast.success("موقعیت مکانی با موفقیت ثبت شد.");
      setGeoState("success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطا در ذخیره موقعیت.";
      toast.error(message);
      setGeoState("error");
      setErrorMsg(message);
    }
  };

  const handleManualChange = (field: "lat" | "lng", value: string) => {
    const num = parseFloat(value);
    if (field === "lat") setLat(isNaN(num) ? null : num);
    else setLng(isNaN(num) ? null : num);
  };

  const hasLocation = lat != null && lng != null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-6 space-y-5",
        className
      )}
    >

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gold/15 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h3 className="font-bold text-base">موقعیت مکانی من</h3>
            <p className="text-xs text-muted mt-0.5">
              هنرجوها می‌تونن استادهای نزدیک خودشون رو پیدا کنن
            </p>
          </div>
        </div>

        {hasLocation && geoState === "success" && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            ثبت شده
          </div>
        )}
      </div>

      {hasLocation && (
        <div className="rounded-xl bg-bg-2 border border-line p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">عرض جغرافیایی</span>
            <span className="font-mono text-ink">{lat?.toFixed(6)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">طول جغرافیایی</span>
            <span className="font-mono text-ink">{lng?.toFixed(6)}</span>
          </div>
          {address && (
            <div className="pt-2 border-t border-line">
              <p className="text-xs text-muted mb-1">آدرس تقریبی</p>
              <p className="text-sm leading-relaxed">{address}</p>
            </div>
          )}
        </div>
      )}

 
      {errorMsg && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}


      {manualMode && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">عرض جغرافیایی (Latitude)</Label>
            <Input
              type="number"
              step="any"
              placeholder="35.7219"
              value={lat ?? ""}
              onChange={(e) => handleManualChange("lat", e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">طول جغرافیایی (Longitude)</Label>
            <Input
              type="number"
              step="any"
              placeholder="51.3347"
              value={lng ?? ""}
              onChange={(e) => handleManualChange("lng", e.target.value)}
              className="font-mono"
            />
          </div>
        </div>
      )}

  
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={getCurrentPosition}
          disabled={geoState === "locating" || geoState === "saving"}
          className="gap-2"
        >
          {geoState === "locating" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال یافتن موقعیت...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              استفاده از موقعیت فعلی
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setManualMode((v) => !v)}
          disabled={geoState === "locating" || geoState === "saving"}
        >
          {manualMode ? "بستن ورود دستی" : "ورود دستی مختصات"}
        </Button>

        {hasLocation && (
          <Button
            type="button"
            onClick={handleSave}
            disabled={geoState === "saving" || geoState === "locating"}
            className="gap-2 bg-gradient-to-l from-[#d4a84b] via-[#e0b85c] to-[#d4a84b] text-[#1a160f] hover:brightness-110"
          >
            {geoState === "saving" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                ذخیره موقعیت
              </>
            )}
          </Button>
        )}
      </div>

      <p className="text-[11px] text-muted leading-relaxed">
        با ثبت موقعیت، هنرجوها می‌تونن بر اساس فاصله، نزدیک‌ترین استادها رو پیدا کنن.
        موقعیت شما فقط برای مرتب‌سازی استفاده می‌شه و به صورت عمومی نمایش داده نمی‌شه.
      </p>
    </div>
  );
}