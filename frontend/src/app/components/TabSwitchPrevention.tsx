"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Eye, ShieldAlert } from "lucide-react";

export function useTabSwitchPrevention(onTabSwitch?: (count: number) => void) {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const next = prev + 1;
          if (onTabSwitch) onTabSwitch(next);
          return next;
        });
        setIsWindowFocused(false);
      } else {
        setIsWindowFocused(true);
      }
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
    };

    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [onTabSwitch]);

  return { tabSwitchCount, isWindowFocused };
}

export function TabSwitchWarningBanner({ switchCount, maxAllowed = 3 }: { switchCount: number; maxAllowed?: number }) {
  if (switchCount === 0) return null;

  const isCritical = switchCount >= maxAllowed;

  return (
    <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
      isCritical ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-amber-500/10 border-amber-500/30 text-amber-300"
    }`}>
      <div className="flex items-center gap-2">
        <ShieldAlert className={`w-4 h-4 shrink-0 ${isCritical ? "text-red-400 animate-pulse" : "text-amber-400"}`} />
        <div>
          <span className="font-bold">Anti-Cheating Telemetry Active: </span>
          <span>{switchCount} tab switch/focus loss event(s) logged.</span>
        </div>
      </div>
      <span className="badge badge-red font-semibold shrink-0">
        {isCritical ? "⚠️ Flagged to Recruiter" : `Limit: ${maxAllowed}`}
      </span>
    </div>
  );
}
