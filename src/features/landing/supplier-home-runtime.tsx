"use client";

import { useEffect, useRef } from "react";
import { setupSupplierInteractions } from "./supplier-home-interactions";
import { setupSupplierMotion } from "./supplier-home-motion";
import { setupSupplierScroll } from "./supplier-home-scroll";

export interface SupplierRuntimeContext {
  root: HTMLElement;
  signal: AbortSignal;
  isArabic: boolean;
}

/** Enhances the server-rendered supplier homepage, without global script state. */
export function SupplierHomeRuntime({ locale }: { locale: string }) {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(".supplier-home");
    if (!root) return;
    const controller = new AbortController();
    const context = {
      root,
      signal: controller.signal,
      isArabic: locale === "ar",
    };
    // Register filter/form handlers before their visual enhancements.
    const cleanInteractions = setupSupplierInteractions(context);
    const cleanMotion = setupSupplierMotion(context);
    const cleanScroll = setupSupplierScroll(context);

    return () => {
      controller.abort();
      cleanScroll();
      cleanMotion();
      cleanInteractions();
    };
  }, [locale]);

  return <span ref={marker} hidden aria-hidden="true" />;
}
