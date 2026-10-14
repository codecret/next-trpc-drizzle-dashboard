(() => {
  "use strict";

  // Content is fully visible without this optional enhancement.
  if (!Element.prototype.animate) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 760px)");
  const quiet = () =>
    reduced.matches || document.documentElement.dataset.motion === "reduced";
  const targets = new Map();
  const sections = new Map();
  let frame = 0;
  let navigating = false;
  let navigationTimer = 0;

  const finish = (item) => {
    item.animation?.cancel();
    item.animation = null;
    item.state = "complete";
    item.element.dataset.scrollReveal = "complete";
  };
  const prepare = (item) => {
    finish(item);
    if (quiet() || item.element.contains(document.activeElement)) return;
    item.distance = compact.matches ? 16 : item.kind === "card" ? 24 : 18;
    item.animation = item.element.animate(
      [
        {
          opacity: item.kind === "card" ? 0.12 : 0.35,
          transform: `translateY(${item.distance}px)`,
        },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: compact.matches ? 620 : item.kind === "card" ? 800 : 700,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "both",
      },
    );
    item.animation.pause();
    item.animation.currentTime = 0;
    item.animation.finished.catch(() => {});
    item.state = "ready";
    item.element.dataset.scrollReveal = "ready";
  };
  const add = (selector, kind) => {
    document.querySelectorAll(selector).forEach((element) => {
      const section = element.closest("section");
      if (!section) return;
      if (!sections.has(section))
        sections.set(section, {
          element: section,
          items: [],
          outside: false,
          played: false,
        });
      const group = sections.get(section);
      const item = {
        element,
        kind,
        group,
        state: "complete",
        animation: null,
        distance: 0,
        count: 0,
      };
      targets.set(element, item);
      group.items.push(item);
    });
  };
  add(
    ".toshiba-ranges .section-head, .fp-heading-copy, .ct-heading > div, .tb-heading-copy, " +
      ".capabilities-intro > h2, .capabilities-intro > p, " +
      ".company-story > h2, .company-story > p, .quote-copy > h2",
    "copy",
  );
  add(
    ".range-grid > .range, .fp-group .fp-card, " +
      ".ct-food-card, .ct-supply-card, .tb-card, .capabilities-list > details, .company-record > div",
    "card",
  );

  const play = (item, delay) => {
    const animation = item.animation;
    if (!animation) return;
    if (item.element.contains(document.activeElement)) {
      finish(item);
      return;
    }
    item.state = "revealing";
    item.group.played = true;
    item.element.dataset.scrollReveal = "revealing";
    item.element.dataset.scrollRevealCount = String(++item.count);
    animation.effect.updateTiming({ delay });
    animation.currentTime = 0;
    animation.play();
    animation.finished
      .then(() => {
        // A previous cycle must never finish an animation prepared for a new visit.
        if (item.animation === animation) finish(item);
      })
      .catch(() => {});
  };

  const update = () => {
    frame = 0;
    if (document.hidden || quiet()) return;
    const height = innerHeight;
    const groups = [...sections.values()].map((group) => ({
      group,
      bounds: group.element.getBoundingClientRect(),
    }));
    const waiting = [...targets.values()]
      .filter((item) => item.state === "ready")
      .map((item) => ({
        item,
        bounds: item.element.getBoundingClientRect(),
      }));
    for (const { group, bounds } of groups) {
      const outside = bounds.bottom < -120 || bounds.top > height + 120;
      if (outside && !group.outside && group.played) {
        // Re-arm only when the whole section is well outside the screen.
        // Small up/down movements inside a section never restart it.
        group.items.forEach(prepare);
        group.played = false;
      }
      group.outside = outside;
    }
    if (navigating) return;
    const entering = waiting
      .filter(
        ({ item, bounds }) =>
          item.state === "ready" &&
          bounds.height > 0 &&
          bounds.top - item.distance < height * 0.78 &&
          bounds.bottom - item.distance > 0,
      )
      .sort((a, b) => {
        const topA = a.bounds.top - a.item.distance;
        const topB = b.bounds.top - b.item.distance;
        return Math.abs(topA - topB) < 36
          ? a.bounds.left - b.bounds.left
          : topA - topB;
      });
    let previousTop = -Infinity;
    let previousGroup = null;
    let column = 0;
    for (const { item, bounds } of entering) {
      const top = bounds.top - item.distance;
      column =
        item.group === previousGroup && Math.abs(top - previousTop) < 36
          ? column + 1
          : 0;
      previousTop = top;
      previousGroup = item.group;
      play(item, Math.min(column, 3) * 75);
    }
  };
  const schedule = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(update);
  };

  // Already visible content stays solid at load. Lower content is prepared
  // before entering the reading area, avoiding an opaque-to-faded flash.
  targets.forEach((item) => {
    const bounds = item.element.getBoundingClientRect();
    if (quiet() || bounds.top < innerHeight * 0.78) finish(item);
    else prepare(item);
  });
  sections.forEach((group) => {
    group.played = group.items.some((item) => item.state === "complete");
  });
  schedule();

  const endNavigation = () => {
    clearTimeout(navigationTimer);
    navigating = false;
    schedule();
  };
  const beginNavigation = () => {
    navigating = true;
    clearTimeout(navigationTimer);
    // Covers a link whose destination is already at the current scroll position.
    navigationTimer = setTimeout(endNavigation, 180);
  };
  window.addEventListener(
    "scroll",
    () => {
      if (navigating) {
        clearTimeout(navigationTimer);
        navigationTimer = setTimeout(endNavigation, 120);
      }
      schedule();
    },
    { passive: true },
  );
  window.addEventListener("scrollend", () => {
    if (navigating) endNavigation();
  });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("load", schedule, { once: true });
  document.fonts?.ready.then(schedule);
  if ("ResizeObserver" in window)
    new ResizeObserver(schedule).observe(
      document.querySelector("main") || document.body,
    );

  const settleInteraction = (event) => {
    targets.forEach((item) => {
      if (item.element.contains(event.target)) finish(item);
    });
  };
  document.addEventListener("focusin", settleInteraction);
  document.addEventListener("pointerdown", settleInteraction, {
    passive: true,
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey)
      beginNavigation();
  });
  window.addEventListener("hashchange", beginNavigation);
  window.addEventListener(
    "wheel",
    () => {
      if (navigating) endNavigation();
    },
    { passive: true },
  );
  window.addEventListener(
    "touchstart",
    () => {
      if (navigating) endNavigation();
    },
    { passive: true },
  );
  document.addEventListener("keydown", (event) => {
    if (
      navigating &&
      [
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " ",
      ].includes(event.key)
    )
      endNavigation();
  });
  document.querySelector(".fp-filters")?.addEventListener("click", () => {
    targets.forEach((item) => {
      if (item.element.closest(".fp-section")) finish(item);
    });
    schedule();
  });

  const applyPreference = () => {
    if (quiet()) targets.forEach(finish);
    else
      sections.forEach((group) => {
        const bounds = group.element.getBoundingClientRect();
        if (bounds.bottom < -120 || bounds.top > innerHeight + 120)
          group.items.forEach(prepare);
      });
    schedule();
  };
  reduced.addEventListener("change", applyPreference);
  window.addEventListener("sfgt:motion-change", applyPreference);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      targets.forEach((item) => {
        if (item.state === "revealing") finish(item);
      });
    } else schedule();
  });
  window.addEventListener("pagehide", () => {
    clearTimeout(navigationTimer);
    navigating = false;
    cancelAnimationFrame(frame);
    frame = 0;
    targets.forEach(finish);
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) applyPreference();
  });
})();
