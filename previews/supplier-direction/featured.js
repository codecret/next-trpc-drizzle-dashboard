(() => {
  const isArabic = document.documentElement.lang === "ar";
  const section = document.querySelector(".fp-section");
  if (!section) return;

  const filters = Array.from(section.querySelectorAll("[data-fp-filter]"));
  const groups = Array.from(section.querySelectorAll("[data-fp-group]"));
  const status = section.querySelector("#fp-status");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const selection = button.dataset.fpFilter;
      const selectedGroup = groups.find(
        (group) => group.dataset.fpGroup === selection,
      );
      if (!selectedGroup) return;

      filters.forEach((filter) => {
        filter.setAttribute("aria-pressed", String(filter === button));
      });
      groups.forEach((group) => {
        group.hidden = group !== selectedGroup;
      });
      if (status) {
        status.textContent = isArabic
          ? `عرض 3 منتجات مختارة من ${selectedGroup.dataset.fpLabel}.`
          : `Showing 3 selected products from ${selectedGroup.dataset.fpLabel.toLowerCase()}.`;
      }
    });
  });
})();
