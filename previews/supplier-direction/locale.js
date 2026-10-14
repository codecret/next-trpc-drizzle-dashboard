(() => {
  const isArabic = document.documentElement.lang === "ar";
  const updateLinks = () => {
    document.querySelectorAll("[data-locale]").forEach((link) => {
      const page = link.dataset.locale === "ar" ? "ar.html" : "index.html";
      link.href = `./${page}${location.hash}`;
    });
  };
  updateLinks();
  window.addEventListener("hashchange", updateLinks);
  // The browser's UI language can differ from the selected site language.
  if (isArabic) {
    const form = document.querySelector("#preview-enquiry");
    const validate = (field) => {
      field.setCustomValidity("");
      if (field.name === "message" && field.value.trim().length < 10)
        field.setCustomValidity("يرجى كتابة استفسارك في 10 أحرف على الأقل.");
      else if (field.validity.valueMissing)
        field.setCustomValidity("يرجى تعبئة هذا الحقل.");
      else if (field.validity.typeMismatch)
        field.setCustomValidity("يرجى إدخال بريد إلكتروني صحيح.");
    };
    form?.addEventListener(
      "invalid",
      (event) => {
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        )
          validate(event.target);
      },
      true,
    );
    form
      ?.querySelectorAll("input[required], textarea[required]")
      .forEach((field) => {
        field.addEventListener("input", () => validate(field));
      });
  }
})();
