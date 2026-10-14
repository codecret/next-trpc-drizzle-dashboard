(() => {
  "use strict";

  const isArabic = document.documentElement.lang === "ar";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let manualReduced = false;
  try {
    manualReduced = localStorage.getItem("sfgt-reduced-motion") === "true";
  } catch {}
  const motionReduced = () => reduced.matches || manualReduced;
  if (motionReduced()) document.documentElement.dataset.motion = "reduced";
  const running = new Set();
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const animate = (element, frames, options) => {
    if (motionReduced() || !element?.animate) return null;
    const animation = element.animate(frames, {
      duration: 620,
      easing: ease,
      ...options,
    });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
    return animation;
  };

  // Typography and image framing stay steady. Only visible photography settles.
  if (!location.hash || location.hash === "#") {
    document.querySelectorAll(".division-visual > img").forEach((image) => {
      if (image.getBoundingClientRect().top >= innerHeight * 0.85) return;
      animate(
        image,
        [
          { opacity: 0.85, transform: "scale(1.025)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: 900, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
      );
    });
  }

  const filters = document.querySelector(".fp-filters");
  if (filters) {
    const track = document.createElement("span");
    track.className = "fp-filter-track";
    track.setAttribute("aria-hidden", "true");
    filters.append(track);
    filters.classList.add("motion-filters");
    let previous = filters.querySelector('[aria-pressed="true"]');
    let productAnimations = [];
    const positionTrack = () => {
      const active = filters.querySelector('[aria-pressed="true"]');
      if (!active) return;
      track.style.width = `${active.offsetWidth}px`;
      track.style.transform = `translateX(${active.offsetLeft}px)`;
    };
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-fp-filter]");
      if (!button) return;
      positionTrack();
      if (button === previous) return;
      previous = button;
      productAnimations.forEach((animation) => animation?.cancel());
      productAnimations = [];
      const group = document.querySelector(".fp-group:not([hidden])");
      group
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
              { duration: 550, delay: index * 65, fill: "backwards" },
            ),
          );
        });
    });
    positionTrack();
    if ("ResizeObserver" in window)
      new ResizeObserver(positionTrack).observe(filters);
    document.fonts?.ready.then(positionTrack);
  }

  const form = document.querySelector("#preview-enquiry");
  const productField = form?.elements.namedItem("product");
  if (form && productField) {
    const catalogue = new Map();
    document
      .querySelectorAll(".fp-enquire[data-enquiry-product]")
      .forEach((link) => {
        const card = link.closest(".fp-card");
        catalogue.set(link.dataset.enquiryProduct, {
          image: card
            ?.querySelector(".fp-product-image img")
            ?.getAttribute("src"),
          name: card?.querySelector("h3")?.textContent.trim(),
          model: card?.querySelector(".fp-model")?.textContent.trim(),
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
    copy.append(eyebrow, name, model);
    const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    check.setAttribute("viewBox", "0 0 24 24");
    check.setAttribute("fill", "none");
    check.setAttribute("stroke", "currentColor");
    check.setAttribute("stroke-width", "1.5");
    const checkPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    checkPath.setAttribute("d", "M4 12.5 9 17.5 20 6.5");
    check.append(checkPath);
    slip.append(photo, copy, check);
    productField.after(slip);
    let selected = "";
    form.addEventListener("enquiry:prefilled", (event) => {
      const item = catalogue.get(event.detail.product);
      if (!item?.image) return;
      selected = event.detail.product;
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
        { duration: 600 },
      );
      const length = checkPath.getTotalLength();
      animate(
        checkPath,
        [
          { strokeDasharray: `${length}`, strokeDashoffset: length },
          { strokeDasharray: `${length}`, strokeDashoffset: 0 },
        ],
        { duration: 400, delay: 180, fill: "backwards" },
      );
    });
    productField.addEventListener("input", () => {
      if (
        !productField.value
          .split(";")
          .map((value) => value.trim())
          .includes(selected)
      )
        slip.hidden = true;
    });
  }

  const motionToggle = document.createElement("button");
  motionToggle.type = "button";
  motionToggle.className = "motion-toggle";
  motionToggle.textContent = isArabic ? "تقليل الحركة" : "Reduce motion";
  document.querySelector(".footer-bottom")?.append(motionToggle);
  const updatePreference = () => {
    const quiet = motionReduced();
    if (quiet) document.documentElement.dataset.motion = "reduced";
    else delete document.documentElement.dataset.motion;
    motionToggle.setAttribute("aria-pressed", String(quiet));
    motionToggle.disabled = reduced.matches;
    motionToggle.title = reduced.matches
      ? isArabic
        ? "تقليل الحركة مفعّل وفق إعدادات جهازك"
        : "Reduced motion follows your device setting"
      : isArabic
        ? "تقليل الرسوم المتحركة في هذا الموقع"
        : "Reduce animations on this website";
    if (quiet) {
      running.forEach((animation) => animation.cancel());
    }
    window.dispatchEvent(
      new CustomEvent("sfgt:motion-change", { detail: { reduced: quiet } }),
    );
  };
  motionToggle.addEventListener("click", () => {
    manualReduced = !manualReduced;
    try {
      localStorage.setItem("sfgt-reduced-motion", String(manualReduced));
    } catch {}
    updatePreference();
  });
  reduced.addEventListener("change", updatePreference);
  updatePreference();
})();
