(() => {
  "use strict";

  const selector =
    '.supply-step-visual img[src$=".svg"], .company-city-sketch img[src$=".svg"]';
  const geometrySelector =
    "path, rect, circle, ellipse, line, polyline, polygon";
  const svgNamespace = "http://www.w3.org/2000/svg";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let manuallyReduced = document.documentElement.dataset.motion === "reduced";
  try {
    manuallyReduced ||= localStorage.getItem("sfgt-reduced-motion") === "true";
  } catch {
    // The page-level preference still works when browser storage is blocked.
  }

  if (
    reducedMotion.matches ||
    manuallyReduced ||
    !("IntersectionObserver" in window) ||
    typeof SVGElement.prototype.animate !== "function"
  ) {
    return;
  }

  // These local drawings need no CSS, references, executable nodes, or URLs.
  // Reject unsupported SVGs instead of changing their appearance on import.
  const allowedElements = new Set([
    "svg",
    "g",
    "path",
    "rect",
    "circle",
    "ellipse",
    "line",
    "polyline",
    "polygon",
    "title",
    "desc",
  ]);
  const allowedAttributes = new Set([
    "viewBox",
    "preserveAspectRatio",
    "fill",
    "fill-rule",
    "fill-opacity",
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "opacity",
    "transform",
    "d",
    "x",
    "y",
    "x1",
    "y1",
    "x2",
    "y2",
    "width",
    "height",
    "rx",
    "ry",
    "cx",
    "cy",
    "r",
    "points",
    "vector-effect",
  ]);
  const states = new Map();
  const requests = new Set();
  let titleNumber = 0;
  let stopped = false;

  function importDrawing(source) {
    const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
    const root = parsed.documentElement;
    if (
      parsed.querySelector("parsererror") ||
      root.localName !== "svg" ||
      root.namespaceURI !== svgNamespace
    ) {
      throw new Error("Invalid local SVG");
    }

    function copyElement(element) {
      if (
        element.namespaceURI !== svgNamespace ||
        !allowedElements.has(element.localName)
      ) {
        throw new Error("Unsupported SVG element");
      }
      const copy = document.createElementNS(svgNamespace, element.localName);
      for (const attribute of element.attributes) {
        if (attribute.name === "xmlns") continue;
        if (
          !allowedAttributes.has(attribute.name) ||
          /url\s*\(|javascript:|data:/i.test(attribute.value)
        ) {
          throw new Error("Unsupported SVG attribute");
        }
        copy.setAttribute(attribute.name, attribute.value);
      }
      if (element.localName === "title" || element.localName === "desc") {
        copy.textContent = element.textContent;
      } else {
        for (const child of element.children) copy.append(copyElement(child));
      }
      return copy;
    }

    const drawing = copyElement(root);
    const dimensions = (drawing.getAttribute("viewBox") || "")
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (
      dimensions.length !== 4 ||
      !dimensions.every(Number.isFinite) ||
      dimensions[2] <= 0 ||
      dimensions[3] <= 0 ||
      !drawing.querySelector(geometrySelector)
    ) {
      throw new Error("SVG needs a valid viewBox and geometry");
    }
    return drawing;
  }

  function finish(state) {
    if (state.done) return;
    state.done = true;
    state.animations.forEach((animation) => animation.cancel());
    state.animations.length = 0;
    state.ink?.remove();
    state.ink = null;
    state.wrapper.dataset.sketchState = "complete";
  }

  function cityTiming(path, index, count, viewBox) {
    const bounds = path.getBBox();
    const style = getComputedStyle(path);
    const channels = style.stroke.match(/[\d.]+/g)?.map(Number) || [];
    const [red = 0, green = 0, blue = 0] = channels;
    const isAccent = red > 140 && red > green * 1.5 && red > blue * 1.4;
    const position = Math.max(
      0,
      Math.min(1, (bounds.x - viewBox.x) / viewBox.width),
    );
    const isGround = bounds.height < 8 && bounds.y > viewBox.height * 0.84;

    if (isAccent) return { delay: 1070 + position * 60, duration: 300 };
    if (isGround) return { delay: 0, duration: 470 };
    if (red >= 150 && green >= 150 && blue >= 140) {
      return { delay: 75 + position * 100, duration: 640 };
    }
    if (parseFloat(style.strokeWidth) >= 0.85) {
      return { delay: 180 + position * 150, duration: 720 };
    }
    return {
      delay: 420 + position * 120 + (index / count) * 40,
      duration: 700,
    };
  }

  function draw(state, visibilityDelay) {
    if (state.started || state.done) return;
    state.started = true;
    if (
      stopped ||
      reducedMotion.matches ||
      document.hidden ||
      !state.wrapper.isConnected
    ) {
      finish(state);
      return;
    }

    try {
      const ink = state.art.cloneNode(true);
      ink.classList.replace("motion-sketch-art", "motion-sketch-ink");
      ink.removeAttribute("role");
      ink.removeAttribute("aria-labelledby");
      ink.setAttribute("aria-hidden", "true");
      ink
        .querySelectorAll("title, desc")
        .forEach((element) => element.remove());
      state.stage.append(ink);
      state.ink = ink;

      const paths = [...ink.querySelectorAll(geometrySelector)].filter(
        (path) =>
          typeof path.getTotalLength === "function" &&
          getComputedStyle(path).stroke !== "none",
      );
      if (!paths.length) {
        finish(state);
        return;
      }

      const duration = state.city ? 1450 : 940;
      const entryDelay = state.city ? 0 : visibilityDelay;
      state.wrapper.dataset.sketchState = "drawing";
      state.animations.push(
        state.art.animate(
          [
            { opacity: 0.32, offset: 0 },
            { opacity: 0.32, offset: 0.76 },
            { opacity: 1, offset: 1 },
          ],
          { duration, delay: entryDelay, easing: "linear", fill: "both" },
        ),
      );

      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        if (!Number.isFinite(length) || length <= 0) return;
        const timing = state.city
          ? cityTiming(path, index, paths.length, ink.viewBox.baseVal)
          : {
              delay: (index / Math.max(1, paths.length - 1)) * 330,
              duration: 360 + Math.min(180, length * 0.45),
            };
        // Inline styles live only on this temporary stroke layer.
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = String(length);
        state.animations.push(
          path.animate(
            [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
            {
              duration: timing.duration,
              delay: timing.delay + entryDelay,
              easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
              fill: "both",
            },
          ),
        );
      });

      Promise.allSettled(
        state.animations.map((animation) => animation.finished),
      ).then(() => finish(state));
    } catch {
      // A geometry or animation failure always restores the complete drawing.
      finish(state);
    }
  }

  let observer;
  let observerHeight = 0;
  let resizeFrame = 0;

  function observeDrawings() {
    if (stopped) return;
    const height = Math.max(1, window.innerHeight);
    if (observer && observerHeight === height) return;
    observerHeight = height;
    observer?.disconnect();
    // Start at 76% of viewport height, when the drawing is clearly in view.
    // IntersectionObserver percentage margins use width, so calculate pixels.
    observer = new IntersectionObserver(
      (entries, currentObserver) => {
        if (stopped) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        let stepIndex = 0;
        visible.forEach((entry) => {
          const state = states.get(entry.target);
          if (!state || state.started || state.done) return;
          currentObserver.unobserve(entry.target);
          draw(state, state.city ? 0 : Math.min(stepIndex++ * 80, 160));
        });
      },
      {
        threshold: 0,
        rootMargin: `0px 0px -${Math.round(height * 0.24)}px 0px`,
      },
    );
    states.forEach((state) => {
      if (!state.started && !state.done) observer.observe(state.wrapper);
    });
  }

  const queueObserverUpdate = () => {
    if (stopped || resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      observeDrawings();
    });
  };
  observeDrawings();
  window.addEventListener("resize", queueObserverUpdate, { passive: true });

  async function enhance(original) {
    const controller = new AbortController();
    requests.add(controller);
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    try {
      const url = new URL(original.getAttribute("src"), document.baseURI);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol))
        return;
      const response = await fetch(url, {
        signal: controller.signal,
        credentials: "same-origin",
        mode: "same-origin",
      });
      if (!response.ok) return;
      const source = await response.text();
      if (
        source.length > 150000 ||
        stopped ||
        reducedMotion.matches ||
        !original.isConnected
      )
        return;
      const art = importDrawing(source);
      const wrapper = document.createElement("span");
      const stage = document.createElement("span");
      const decorative =
        original.alt === "" ||
        Boolean(original.closest('[aria-hidden="true"]'));
      wrapper.className = "motion-sketch";
      wrapper.dataset.sketchState = "ready";
      stage.className = "motion-sketch-stage";
      art.classList.add("motion-sketch-art");
      art.setAttribute("focusable", "false");
      art
        .querySelectorAll("title, desc")
        .forEach((element) => element.remove());
      if (decorative) {
        wrapper.setAttribute("aria-hidden", "true");
        art.setAttribute("aria-hidden", "true");
      } else {
        const title = document.createElementNS(svgNamespace, "title");
        title.id = `motion-sketch-title-${++titleNumber}`;
        title.textContent = original.alt || "Architectural line illustration";
        art.prepend(title);
        art.setAttribute("role", "img");
        art.setAttribute("aria-labelledby", title.id);
      }
      const state = {
        wrapper,
        stage,
        art,
        ink: null,
        city: Boolean(original.closest(".company-city-sketch")),
        animations: [],
        started: false,
        done: false,
      };
      stage.append(art);
      wrapper.append(stage);
      original.replaceWith(wrapper);
      states.set(wrapper, state);
      observer.observe(wrapper);
    } catch {
      // Network, parsing, and unsupported-art failures leave the original img.
    } finally {
      clearTimeout(timeout);
      requests.delete(controller);
    }
  }

  function stop() {
    stopped = true;
    cancelAnimationFrame(resizeFrame);
    window.removeEventListener("resize", queueObserverUpdate);
    observer.disconnect();
    requests.forEach((controller) => controller.abort());
    states.forEach(finish);
  }

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) stop();
  });
  window.addEventListener("sfgt:motion-change", (event) => {
    if (event.detail?.reduced === true) stop();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      states.forEach((state) => {
        if (state.started) finish(state);
      });
    }
  });
  window.addEventListener("pagehide", stop, { once: true });

  function start() {
    if (stopped || reducedMotion.matches) return;
    document.querySelectorAll(selector).forEach(enhance);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
