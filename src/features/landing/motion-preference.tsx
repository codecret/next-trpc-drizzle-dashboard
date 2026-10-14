"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";

const storageKey = "sfgt-reduced-motion";
const eventName = "sfgt:motion-change";
let sessionReduced: boolean | undefined;

function systemReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readReduced() {
  if (sessionReduced !== undefined) return systemReduced() || sessionReduced;
  try {
    return systemReduced() || localStorage.getItem(storageKey) === "true";
  } catch {
    return systemReduced();
  }
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  function onStorage(event: StorageEvent) {
    if (event.key !== storageKey && event.key !== null) return;
    sessionReduced = undefined;
    onChange();
  }
  media.addEventListener("change", onChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(eventName, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventName, onChange);
  };
}

function serverSnapshot() {
  return false;
}

function applyMotion(reduced: boolean) {
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  window.dispatchEvent(new CustomEvent(eventName, { detail: { reduced } }));
}

export function MotionPreference() {
  const isArabic = useLocale() === "ar";
  const reduced = useSyncExternalStore(subscribe, readReduced, serverSnapshot);
  const followsSystem = useSyncExternalStore(
    subscribe,
    systemReduced,
    serverSnapshot
  );

  useEffect(() => {
    applyMotion(readReduced());
  }, [reduced]);

  function toggleMotion() {
    if (followsSystem) return;
    const nextReduced = !reduced;
    try {
      localStorage.setItem(storageKey, String(nextReduced));
      sessionReduced = undefined;
    } catch {
      // Keep the preference for this visit when browser storage is unavailable.
      sessionReduced = nextReduced;
    }
    applyMotion(nextReduced);
  }

  const label = isArabic ? "تقليل الحركة" : "Reduce motion";
  const systemTitle = isArabic
    ? "تقليل الحركة مفعّل في إعدادات جهازك"
    : "Reduced motion is enabled in your device settings";

  return (
    <button
      type="button"
      className="industrial-motion-toggle"
      role="switch"
      aria-checked={reduced}
      aria-label={label}
      title={followsSystem ? systemTitle : label}
      disabled={followsSystem}
      onClick={toggleMotion}
    >
      <span className="industrial-motion-track" aria-hidden="true">
        <span />
      </span>
      <span>{label}</span>
      <span className="industrial-motion-state" aria-hidden="true">
        {isArabic ? (reduced ? "مفعّل" : "متوقف") : reduced ? "On" : "Off"}
      </span>
    </button>
  );
}
