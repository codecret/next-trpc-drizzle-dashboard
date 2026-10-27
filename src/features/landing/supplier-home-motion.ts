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
      duration: 620,
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
        animate(
          image,
          [
            { opacity: 0.85, transform: "scale(1.025)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: 900, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)" }
        );
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
                    opacity: 0.2,
                    transform: `translateX(${isArabic ? -24 : 24}px) scale(0.97)`,
                  },
                  { opacity: 1, transform: "translateX(0) scale(1)" },
                ],
                { duration: 550, delay: index * 65, fill: "backwards" }
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

  const form = root.querySelector<HTMLFormElement>("#preview-enquiry");
  const productField = form?.elements.namedItem("product");
  if (form && productField instanceof HTMLInputElement) {
    const catalogue = new Map<
      string,
      { image: string; name: string; model: string }
    >();
    root
      .querySelectorAll<HTMLAnchorElement>(".fp-enquire[data-enquiry-product]")
      .forEach((link) => {
        const card = link.closest(".fp-card");
        const key = link.dataset.enquiryProduct;
        const image = card
          ?.querySelector(".fp-product-image img")
          ?.getAttribute("src");
        if (key && image)
          catalogue.set(key, {
            image,
            name: card?.querySelector("h3")?.textContent?.trim() ?? "",
            model: card?.querySelector(".fp-model")?.textContent?.trim() ?? "",
          });
      });
    const slip = document.createElement("div");
    slip.className = "quote-selection";
    slip.hidden = true;
    slip.setAttribute("aria-hidden", "true");
    const photo = document.createElement("img");
    photo.alt = "";
    const copy = document.createElement("div");
    const eyebrow = document.createElement("small");
    eyebrow.textContent = isArabic
      ? "تمت الإضافة إلى استفسارك"
      : "Added to your enquiry";
    const name = document.createElement("strong");
    const model = document.createElement("span");
    name.dir = model.dir = "ltr";
    name.lang = model.lang = "en";
    copy.append(eyebrow, name, model);
    const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    check.setAttribute("viewBox", "0 0 24 24");
    check.setAttribute("fill", "none");
    check.setAttribute("stroke", "currentColor");
    check.setAttribute("stroke-width", "1.5");
    const checkPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    checkPath.setAttribute("d", "M4 12.5 9 17.5 20 6.5");
    check.append(checkPath);
    slip.append(photo, copy, check);
    productField.after(slip);
    disposers.push(() => slip.remove());
    let selected = "";
    form.addEventListener(
      "enquiry:prefilled",
      (event) => {
        const detail = (event as CustomEvent<{ product?: string }>).detail;
        if (!detail || typeof detail.product !== "string") return;
        const item = catalogue.get(detail.product);
        if (!item) return;
        selected = detail.product;
        photo.src = item.image;
        name.textContent = item.name;
        model.textContent = item.model;
        slip.hidden = false;
        animate(
          slip,
          [
            {
              opacity: 0,
              transform: "translateY(-10px) rotate(-1deg) scale(0.97)",
            },
            { opacity: 1, transform: "translateY(0) rotate(0) scale(1)" },
          ],
          { duration: 600 }
        );
        if (typeof checkPath.getTotalLength === "function") {
          const length = checkPath.getTotalLength();
          animate(
            checkPath,
            [
              { strokeDasharray: `${length}`, strokeDashoffset: length },
              { strokeDasharray: `${length}`, strokeDashoffset: 0 },
            ],
            { duration: 400, delay: 180, fill: "backwards" }
          );
        }
      },
      { signal }
    );
    productField.addEventListener(
      "input",
      () => {
        if (
          !productField.value
            .split(";")
            .map((value) => value.trim())
            .includes(selected)
        )
          slip.hidden = true;
      },
      { signal }
    );
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
