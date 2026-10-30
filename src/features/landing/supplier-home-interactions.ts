import type { SupplierRuntimeContext } from "./supplier-home-runtime";

export function setupSupplierInteractions({
  root,
  signal,
  isArabic,
}: SupplierRuntimeContext) {
  const updateLocaleLinks = () => {
    root
      .querySelectorAll<HTMLAnchorElement>("a[data-locale]")
      .forEach((link) => {
        link.href = `${link.dataset.locale === "ar" ? "/ar" : "/"}${location.hash}`;
      });
  };
  updateLocaleLinks();
  window.addEventListener("hashchange", updateLocaleLinks, { signal });
  root.querySelectorAll<HTMLAnchorElement>(".mobile-menu a").forEach((link) => {
    link.addEventListener(
      "click",
      () => {
        const menu = link.closest<HTMLDetailsElement>(".mobile-menu");
        if (menu) menu.open = false;
      },
      { signal }
    );
  });
  root.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return;
      const menu = root.querySelector<HTMLDetailsElement>(".mobile-menu[open]");
      if (!menu) return;
      menu.open = false;
      menu.querySelector<HTMLElement>("summary")?.focus();
    },
    { signal }
  );

  const contacts = root.querySelector<HTMLElement>(".contact-actions");
  const contactCleanups: Array<() => void> = [];
  if (contacts) {
    const mobile = window.matchMedia("(max-width: 760px)");
    const menu = root.querySelector<HTMLDetailsElement>(".mobile-menu");
    const contactSections = Array.from(
      root.querySelectorAll<HTMLElement>("#quotation, .footer")
    );
    const visibleSections = new Set<Element>();
    const previousHidden = contacts.getAttribute("data-contact-context-hidden");
    const updateContactVisibility = () => {
      if (signal.aborted) return;
      const shouldHide =
        mobile.matches &&
        (Boolean(menu?.open) || visibleSections.size > 0) &&
        !contacts.contains(document.activeElement);
      if (shouldHide) contacts.dataset.contactContextHidden = "true";
      else delete contacts.dataset.contactContextHidden;
    };
    const measureContactSections = () => {
      contactSections.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.height > 0 && bounds.top < innerHeight && bounds.bottom > 0)
          visibleSections.add(element);
        else visibleSections.delete(element);
      });
      updateContactVisibility();
    };
    measureContactSections();
    if (typeof window.IntersectionObserver === "function") {
      const contactObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRect.height > 0)
              visibleSections.add(entry.target);
            else visibleSections.delete(entry.target);
          });
          updateContactVisibility();
        },
        { threshold: [0, 0.001] }
      );
      contactSections.forEach((element) => contactObserver.observe(element));
      contactCleanups.push(() => contactObserver.disconnect());
    } else {
      window.addEventListener("scroll", measureContactSections, {
        passive: true,
        signal,
      });
    }
    mobile.addEventListener("change", measureContactSections, { signal });
    window.addEventListener("resize", measureContactSections, {
      passive: true,
      signal,
    });
    menu?.addEventListener("toggle", updateContactVisibility, { signal });
    contacts.addEventListener("focusin", updateContactVisibility, { signal });
    contacts.addEventListener(
      "focusout",
      () => {
        // Let focus settle before hiding, including tabbing between both icons.
        queueMicrotask(updateContactVisibility);
      },
      { signal }
    );
    contactCleanups.push(() => {
      if (previousHidden === null) delete contacts.dataset.contactContextHidden;
      else contacts.setAttribute("data-contact-context-hidden", previousHidden);
    });
  }

  const section = root.querySelector(".fp-section");
  const filters = Array.from(
    section?.querySelectorAll<HTMLButtonElement>("[data-fp-filter]") ?? []
  );
  const groups = Array.from(
    section?.querySelectorAll<HTMLElement>("[data-fp-group]") ?? []
  );
  const filterStatus = section?.querySelector("#fp-status");
  filters.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const selectedGroup = groups.find(
          (group) => group.dataset.fpGroup === button.dataset.fpFilter
        );
        if (!selectedGroup) return;
        filters.forEach((filter) =>
          filter.setAttribute("aria-pressed", String(filter === button))
        );
        groups.forEach((group) => {
          group.hidden = group !== selectedGroup;
        });
        if (filterStatus) {
          const label = selectedGroup.dataset.fpLabel ?? "";
          const count = selectedGroup.querySelectorAll(".fp-card").length;
          filterStatus.textContent = isArabic
            ? `عرض ${count} منتجات مختارة من ${label}.`
            : `Showing ${count} selected products from ${label.toLowerCase()}.`;
        }
      },
      { signal }
    );
  });

  const cleanContacts = () =>
    contactCleanups.splice(0).forEach((clean) => clean());
  signal.addEventListener("abort", cleanContacts, { once: true });
  return cleanContacts;
}
