import type { SupplierRuntimeContext } from "./supplier-home-runtime";

export const SUPPLIER_MOTION_EVENT = "supplier:motion-change";

export function setupSupplierMotion({
  root,
  signal,
  isArabic,
}: SupplierRuntimeContext) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const previousMotion = root.dataset.motion;
  let manualReduced = false;
  try {
    manualReduced = localStorage.getItem("sfgt-reduced-motion") === "true";
  } catch {
    /* Storage can be disabled. */
  }
  const motionReduced = () => reduced.matches || manualReduced;
  if (motionReduced()) root.dataset.motion = "reduced";
  else delete root.dataset.motion;
  const running = new Set<Animation>();
  const disposers: Array<() => void> = [];
  const animate = (
    element: Element | null,
    frames: Keyframe[],
    options: KeyframeAnimationOptions = {}
  ) => {
    if (signal.aborted || motionReduced() || !element?.animate) return null;
    const animation = element.animate(frames, {
      duration: 360,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      ...options,
    });
    running.add(animation);
    void animation.finished
      .catch(() => {})
      .finally(() => running.delete(animation));
    return animation;
  };

  if (!location.hash || location.hash === "#") {
    root
      .querySelectorAll<HTMLImageElement>(
        ".corporate-hero-visual > img, .division-visual > img"
      )
      .forEach((image) => {
        if (image.getBoundingClientRect().top >= innerHeight * 0.85) return;
        animate(image, [{ opacity: 0.92 }, { opacity: 1 }], {
          duration: 400,
          easing: "ease-out",
        });
      });
  }

  const filters = root.querySelector<HTMLElement>(".fp-filters");
  if (filters) {
    const track = document.createElement("span");
    track.className = "fp-filter-track";
    track.setAttribute("aria-hidden", "true");
    filters.append(track);
    filters.classList.add("motion-filters");
    let previous = filters.querySelector('[aria-pressed="true"]');
    let productAnimations: Array<Animation | null> = [];
    const positionTrack = () => {
      if (signal.aborted) return;
      const active = filters.querySelector<HTMLElement>(
        '[aria-pressed="true"]'
      );
      if (!active) return;
      track.style.width = `${active.offsetWidth}px`;
      track.style.transform = `translateX(${active.offsetLeft}px)`;
    };
    filters.addEventListener(
      "click",
      (event) => {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest("[data-fp-filter]");
        if (!button || !filters.contains(button)) return;
        positionTrack();
        if (button === previous) return;
        previous = button;
        productAnimations.forEach((animation) => animation?.cancel());
        productAnimations = [];
        root
          .querySelector(".fp-group:not([hidden])")
          ?.querySelectorAll(".fp-product-image img")
          .forEach((image, index) => {
            productAnimations.push(
              animate(
                image,
                [
                  {
                    opacity: 0.8,
                    transform: `translateX(${isArabic ? -6 : 6}px)`,
                  },
                  { opacity: 1, transform: "translateX(0)" },
                ],
                { duration: 260, delay: index * 25, fill: "backwards" }
              )
            );
          });
      },
      { signal }
    );
    positionTrack();
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(positionTrack);
      observer.observe(filters);
      disposers.push(() => observer.disconnect());
    }
    void document.fonts?.ready.then(positionTrack);
    disposers.push(() => {
      track.remove();
      filters.classList.remove("motion-filters");
    });
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "motion-toggle";
  toggle.textContent = isArabic ? "تقليل الحركة" : "Reduce motion";
  root.querySelector(".footer-bottom")?.append(toggle);
  const updatePreference = () => {
    const quiet = motionReduced();
    if (quiet) root.dataset.motion = "reduced";
    else delete root.dataset.motion;
    toggle.setAttribute("aria-pressed", String(quiet));
    toggle.disabled = reduced.matches;
    toggle.title = reduced.matches
      ? isArabic
        ? "تقليل الحركة مفعّل وفق إعدادات جهازك"
        : "Reduced motion follows your device setting"
      : isArabic
        ? "تقليل الرسوم المتحركة في هذا الموقع"
        : "Reduce animations on this website";
    if (quiet) running.forEach((animation) => animation.cancel());
    root.dispatchEvent(
      new CustomEvent(SUPPLIER_MOTION_EVENT, { detail: { reduced: quiet } })
    );
  };
  toggle.addEventListener(
    "click",
    () => {
      manualReduced = !manualReduced;
      try {
        localStorage.setItem("sfgt-reduced-motion", String(manualReduced));
      } catch {
        /* The current-page preference still works. */
      }
      updatePreference();
    },
    { signal }
  );
  reduced.addEventListener("change", updatePreference, { signal });
  updatePreference();

  return () => {
    running.forEach((animation) => animation.cancel());
    disposers.forEach((dispose) => dispose());
    toggle.remove();
    if (previousMotion === undefined) delete root.dataset.motion;
    else root.dataset.motion = previousMotion;
  };
}
