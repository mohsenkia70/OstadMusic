"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Trash2 } from "lucide-react";
import type { WhiteboardEvent } from "@/lib/classroom/types";
import { cn } from "@/lib/utils";

const COLORS = ["#17171b", "#0d9488", "#7c93ff", "#dc2626", "#16a34a"];

export function WhiteboardPanel({
  onSendEvent,
  subscribeToRemoteEvents,
}: {
  onSendEvent: (event: WhiteboardEvent) => void;
  subscribeToRemoteEvents: (handler: (event: WhiteboardEvent) => void) => (() => void) | undefined;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const prev = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.putImageData(prev, 0, 0);
      ctx.lineCap = "round";
      ctxRef.current = ctx;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToRemoteEvents((event) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      if (event.type === "start") {
        ctx.strokeStyle = event.color;
        ctx.lineWidth = event.size;
        ctx.beginPath();
        ctx.moveTo(event.x * canvas.width, event.y * canvas.height);
      } else if (event.type === "draw") {
        ctx.lineTo(event.x * canvas.width, event.y * canvas.height);
        ctx.stroke();
      } else if (event.type === "end") {
        ctx.closePath();
      } else if (event.type === "clear") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
    return unsubscribe;
  }, [subscribeToRemoteEvents]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    drawingRef.current = true;
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x * canvas.width, y * canvas.height);
    onSendEvent({ type: "start", x, y, color, size });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x * canvas.width, y * canvas.height);
    ctx.stroke();
    onSendEvent({ type: "draw", x, y });
  };

  const handlePointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    ctxRef.current?.closePath();
    onSendEvent({ type: "end" });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSendEvent({ type: "clear" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`رنگ ${c}`}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-transform",
                color === c ? "border-gold scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="range"
            min={1}
            max={10}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-16 ms-2"
            aria-label="ضخامت قلم"
          />
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted hover:text-red-600 hover:border-red-200"
        >
          <Trash2 className="h-3.5 w-3.5" /> پاک کردن همه
        </button>
      </div>
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
        />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted px-4 py-2 border-t border-line">
        <Eraser className="h-3.5 w-3.5" /> تخته‌ی سفید بین همه‌ی اعضای کلاس هم‌زمان دیده می‌شود
      </div>
    </div>
  );
}
