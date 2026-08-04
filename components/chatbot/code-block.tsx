"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-line bg-[#0d1117]" dir="ltr">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10">
        <span className="text-xs text-white/50 font-mono">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "کپی شد" : "کپی"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-sm leading-relaxed">
        <code className="text-[#c9d1d9] font-mono">{code}</code>
      </pre>
    </div>
  );
}
