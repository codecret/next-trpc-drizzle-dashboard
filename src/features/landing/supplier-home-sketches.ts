import type { SupplierRuntimeContext } from "./supplier-home-runtime";
import { SUPPLIER_MOTION_EVENT } from "./supplier-home-motion";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const GEOMETRY = "path, rect, circle, ellipse, line, polyline, polygon";
const DRAWINGS =
  '.supply-step-visual img[src$=".svg"], .company-city-sketch img[src$=".svg"]';
const ALLOWED_ELEMENTS = new Set([
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
const ALLOWED_ATTRIBUTES = new Set([
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

type Sketch = {
  original: HTMLImageElement;
  wrapper: HTMLSpanElement;
  stage: HTMLSpanElement;
  art: SVGSVGElement;
  ink: SVGSVGElement | null;
  city: boolean;
  animations: Animation[];
  started: boolean;
  done: boolean;
};

/** Copy only inert geometry from the same-origin, shipped SVG illustrations. */
function importDrawing(source: string): SVGSVGElement {
  const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
  const root = parsed.documentElement;
  if (
    parsed.querySelector("parsererror") ||
    root.localName !== "svg" ||
    root.namespaceURI !== SVG_NAMESPACE
  )
    throw new Error("Invalid local SVG");
  function copyElement(element: Element): SVGElement {
    if (
      element.namespaceURI !== SVG_NAMESPACE ||
      !ALLOWED_ELEMENTS.has(element.localName)
    )
      throw new Error("Unsupported SVG element");
    const copy = document.createElementNS(SVG_NAMESPACE, element.localName);
    for (const attribute of element.attributes) {
      if (attribute.name === "xmlns") continue;
      if (
        !ALLOWED_ATTRIBUTES.has(attribute.name) ||
        /url\s*\(|javascript:|data:/i.test(attribute.value)
      )
        throw new Error("Unsupported SVG attribute");
      copy.setAttribute(attribute.name, attribute.value);
    }
    if (element.localName === "title" || element.localName === "desc")
      copy.textContent = element.textContent;
    else for (const child of element.children) copy.append(copyElement(child));
    return copy;
  }
  const drawing = copyElement(root);
  const dimensions = (drawing.getAttribute("viewBox") ?? "")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (
    !(drawing instanceof SVGSVGElement) ||
    dimensions.length !== 4 ||
    !dimensions.every(Number.isFinite) ||
    dimensions[2] <= 0 ||
    dimensions[3] <= 0 ||
    !drawing.querySelector(GEOMETRY)
  )
    throw new Error("SVG needs a valid viewBox and geometry");
  return drawing;
}

function cityTiming(
  path: SVGGeometryElement,
  index: number,
  count: number,
  viewBox: DOMRect
) {
  const bounds = path.getBBox();
  const style = getComputedStyle(path);
  const channels = style.stroke.match(/[\d.]+/g)?.map(Number) ?? [];
  const [red = 0, green = 0, blue = 0] = channels;
  const accent = red > 140 && red > green * 1.5 && red > blue * 1.4;
  const position = Math.max(
    0,
    Math.min(1, (bounds.x - viewBox.x) / viewBox.width)
  );
  const ground = bounds.height < 8 && bounds.y > viewBox.height * 0.84;
  if (accent) return { delay: 1070 + position * 60, duration: 300 };
  if (ground) return { delay: 0, duration: 470 };
  if (red >= 150 && green >= 150 && blue >= 140)
    return { delay: 75 + position * 100, duration: 640 };
  if (parseFloat(style.strokeWidth) >= 0.85)
    return { delay: 180 + position * 150, duration: 720 };
  return { delay: 420 + position * 120 + (index / count) * 40, duration: 700 };
}

export function setupSupplierSketches({
  root,
  signal,
}: SupplierRuntimeContext) {
  if (
    !("IntersectionObserver" in window) ||
    typeof SVGElement.prototype.animate !== "function"
  )
    return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const quiet = () => reduced.matches || root.dataset.motion === "reduced";
  const states = new Map<Element, Sketch>();
  const requests = new Map<HTMLImageElement, AbortController>();
  const timeouts = new Set<number>();
  let observer: IntersectionObserver | undefined;
  let observerHeight = 0;
  let resizeFrame = 0;
  let titleNumber = 0;

  const finish = (state: Sketch) => {
    if (state.done) return;
    state.done = true;
    state.animations.forEach((animation) => animation.cancel());
    state.animations.length = 0;
    state.ink?.remove();
    state.ink = null;
    state.wrapper.dataset.sketchState = "complete";
  };
  const draw = (state: Sketch, visibilityDelay: number) => {
    if (state.started || state.done) return;
    state.started = true;
    if (
      signal.aborted ||
      quiet() ||
      document.hidden ||
      !state.wrapper.isConnected
    ) {
      finish(state);
      return;
    }
    try {
      const ink = state.art.cloneNode(true) as SVGSVGElement;
      ink.classList.replace("motion-sketch-art", "motion-sketch-ink");
      ink.removeAttribute("role");
      ink.removeAttribute("aria-labelledby");
      ink.setAttribute("aria-hidden", "true");
      ink
        .querySelectorAll("title, desc")
        .forEach((element) => element.remove());
      state.stage.append(ink);
      state.ink = ink;
      const paths = Array.from(
        ink.querySelectorAll<SVGGeometryElement>(GEOMETRY)
      ).filter(
        (path) =>
          typeof path.getTotalLength === "function" &&
          getComputedStyle(path).stroke !== "none"
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
          { duration, delay: entryDelay, easing: "linear", fill: "both" }
        )
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
            }
          )
        );
      });
      void Promise.allSettled(
        state.animations.map((animation) => animation.finished)
      ).then(() => finish(state));
    } catch {
      // Unsupported geometry and interrupted animation leave the complete art.
      finish(state);
    }
  };

  const observeDrawings = () => {
    if (signal.aborted || quiet()) return;
    const height = Math.max(1, innerHeight);
    if (observer && observerHeight === height) return;
    observerHeight = height;
    observer?.disconnect();
    observer = new IntersectionObserver(
      (entries, currentObserver) => {
        if (signal.aborted || quiet()) return;
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
      }
    );
    states.forEach((state) => {
      if (!state.started && !state.done) observer?.observe(state.wrapper);
    });
  };
  const queueObserverUpdate = () => {
    if (signal.aborted || resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      observeDrawings();
    });
  };
  window.addEventListener("resize", queueObserverUpdate, {
    passive: true,
    signal,
  });

  async function enhance(original: HTMLImageElement) {
    if (requests.has(original)) return;
    const controller = new AbortController();
    requests.set(original, controller);
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    timeouts.add(timeout);
    try {
      const url = new URL(original.getAttribute("src") ?? "", document.baseURI);
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
        signal.aborted ||
        quiet() ||
        controller.signal.aborted ||
        requests.get(original) !== controller ||
        !root.contains(original)
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
        const title = document.createElementNS(SVG_NAMESPACE, "title");
        title.id = `supplier-sketch-title-${++titleNumber}`;
        title.textContent = original.alt;
        art.prepend(title);
        art.setAttribute("role", "img");
        art.setAttribute("aria-labelledby", title.id);
      }
      const state: Sketch = {
        original,
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
      observer?.observe(wrapper);
    } catch {
      // Failed fetch or unsupported SVG leaves the original img untouched.
    } finally {
      clearTimeout(timeout);
      timeouts.delete(timeout);
      if (requests.get(original) === controller) requests.delete(original);
    }
  }
  const settle = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = 0;
    observer?.disconnect();
    observer = undefined;
    requests.forEach((controller) => controller.abort());
    requests.clear();
    states.forEach(finish);
  };
  const start = () => {
    if (signal.aborted || quiet()) return;
    observeDrawings();
    root.querySelectorAll<HTMLImageElement>(DRAWINGS).forEach((image) => {
      void enhance(image);
    });
  };
  const applyPreference = () => {
    if (quiet()) settle();
    else start();
  };
  reduced.addEventListener("change", applyPreference, { signal });
  root.addEventListener(SUPPLIER_MOTION_EVENT, applyPreference, { signal });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden)
        states.forEach((state) => {
          if (state.started) finish(state);
        });
    },
    { signal }
  );
  window.addEventListener("pagehide", settle, { signal });
  window.addEventListener(
    "pageshow",
    (event) => {
      if (event.persisted) start();
    },
    { signal }
  );
  start();
  return () => {
    settle();
    timeouts.forEach(clearTimeout);
    states.forEach((state) => {
      // React Strict Mode can mount this effect twice on the same SSR markup.
      if (root.contains(state.wrapper))
        state.wrapper.replaceWith(state.original);
    });
    states.clear();
  };
}
