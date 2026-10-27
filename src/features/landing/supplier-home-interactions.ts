import type { SupplierRuntimeContext } from "./supplier-home-runtime";

export function setupSupplierInteractions({
  root,
  signal,
  isArabic,
}: SupplierRuntimeContext) {
  const localize = (english: string, arabic: string) =>
    isArabic ? arabic : english;
  const frames = new Set<number>();
  const schedule = (callback: () => void) => {
    const frame = requestAnimationFrame(() => {
      frames.delete(frame);
      if (!signal.aborted) callback();
    });
    frames.add(frame);
  };

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

  const form = root.querySelector<HTMLFormElement>("#preview-enquiry.tq-form");
  const field = (name: string) => {
    const element = form?.elements.namedItem(name);
    return element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
      ? element
      : null;
  };
  const division = field("division");
  const product = field("product");
  const message = field("message");
  const orderDetails = form?.querySelector<HTMLDetailsElement>("#tq-order");
  const status = form?.querySelector<HTMLElement>("#tq-status");
  const fallback = form?.querySelector<HTMLElement>("#tq-fallback");
  const draft = form?.querySelector<HTMLTextAreaElement>("#tq-draft");
  const copyStatus = form?.querySelector<HTMLElement>("#tq-copy-status");
  const clean = () => {
    frames.forEach(cancelAnimationFrame);
    form
      ?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        "input, textarea"
      )
      .forEach((input) => input.setCustomValidity(""));
  };
  if (
    !form ||
    !(division instanceof HTMLSelectElement) ||
    !product ||
    !message ||
    !orderDetails ||
    !status ||
    !fallback ||
    !draft ||
    !copyStatus
  )
    return clean;

  const divisionNames = Object.fromEntries(
    Array.from(division.options).map((option) => [
      option.value,
      option.textContent?.trim() ?? "",
    ])
  );
  const recipient = "tbts@sfgt-tbts.com";
  const validate = (input: HTMLInputElement | HTMLTextAreaElement) => {
    input.setCustomValidity("");
    if (input.name === "message" && input.value.trim().length < 10) {
      input.setCustomValidity(
        localize(
          "Please describe your enquiry in at least 10 characters.",
          "يرجى كتابة استفسارك في 10 أحرف على الأقل."
        )
      );
    } else if (isArabic && input.validity.valueMissing) {
      input.setCustomValidity("يرجى تعبئة هذا الحقل.");
    } else if (isArabic && input.validity.typeMismatch) {
      input.setCustomValidity("يرجى إدخال بريد إلكتروني صحيح.");
    }
  };
  form.addEventListener(
    "invalid",
    (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        validate(event.target);
    },
    { capture: true, signal }
  );
  form
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input[required], textarea[required]"
    )
    .forEach((input) => {
      input.addEventListener("input", () => validate(input), { signal });
    });

  const invalidateDraft = (announce = true) => {
    if (fallback.hidden) return;
    fallback.hidden = true;
    draft.value = "";
    copyStatus.textContent = "";
    if (announce)
      status.textContent = localize(
        "Your details have changed. Open a new email draft to include the latest information.",
        "تم تغيير التفاصيل. افتح مسودة بريد جديدة تتضمن أحدث المعلومات."
      );
  };
  const onDetailsEdited = (event: Event) => {
    if (event.target instanceof Element && event.target.getAttribute("name"))
      invalidateDraft();
  };
  form.addEventListener("input", onDetailsEdited, { signal });
  form.addEventListener("change", onDetailsEdited, { signal });

  root.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(
        "a[data-enquiry-product], a[data-enquiry-division]"
      );
      if (
        !link ||
        !root.contains(link) ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const selectedDivision = link.dataset.enquiryDivision ?? "";
      const selectedProduct = (link.dataset.enquiryProduct ?? "").trim();
      invalidateDraft(false);
      if (Object.hasOwn(divisionNames, selectedDivision))
        division.value = selectedDivision;
      if (selectedProduct) {
        const existingProducts = product.value
          .split(";")
          .map((value) => value.trim());
        if (!existingProducts.includes(selectedProduct))
          product.value = product.value.trim()
            ? `${product.value.trim()}; ${selectedProduct}`
            : selectedProduct;
        orderDetails.open = true;
        status.textContent = isArabic
          ? `تمت إضافة ⁦${selectedProduct}⁩ إلى استفسارك. تم الاحتفاظ بجميع التفاصيل التي أدخلتها.`
          : `${selectedProduct} added to your enquiry. Any details already entered are kept.`;
      } else if (Object.hasOwn(divisionNames, selectedDivision)) {
        status.textContent = isArabic
          ? `موضوع الاستفسار: ${divisionNames[selectedDivision]}. تم الاحتفاظ بجميع التفاصيل التي أدخلتها.`
          : `Enquiry set to ${divisionNames[selectedDivision]}. Any details already entered are kept.`;
      }
      const quantity = field("quantity");
      const name = field("name");
      const nextField =
        selectedProduct && quantity && !quantity.value
          ? quantity
          : name && !name.value
            ? name
            : message;
      schedule(() => {
        form.dispatchEvent(
          new CustomEvent("enquiry:prefilled", {
            detail: { product: selectedProduct, division: division.value },
          })
        );
        nextField.focus({ preventScroll: true });
        nextField.scrollIntoView({ behavior: "instant", block: "center" });
      });
    },
    { signal }
  );

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      if (message instanceof HTMLTextAreaElement) validate(message);
      if (!form.reportValidity()) return;
      const read = (name: string) => field(name)?.value.trim() ?? "";
      const enquiryType =
        divisionNames[division.value] || divisionNames.toshiba;
      const subject = isArabic
        ? `استفسار SFGT: ${enquiryType}`
        : `SFGT enquiry: ${enquiryType}`;
      const lines = [
        `${localize("Enquiry", "موضوع الاستفسار")}: ${enquiryType}`,
        `${localize("Name", "الاسم")}: ${read("name")}`,
        `${localize("Reply email", "البريد الإلكتروني للرد")}: ${read("email")}`,
      ];
      const optionalFields = [
        ["company", localize("Company", "الشركة")],
        ["product", localize("Product or model", "المنتج أو الطراز")],
        ["quantity", localize("Quantity & unit", "الكمية والوحدة")],
        ["destination", localize("Delivery destination", "وجهة التسليم")],
      ];
      for (const [name, label] of optionalFields)
        if (read(name)) lines.push(`${label}: ${read(name)}`);
      lines.push(
        "",
        localize("Enquiry details:", "تفاصيل الاستفسار:"),
        read("message")
      );
      const body = lines.join("\n");
      draft.value = `${localize("To", "إلى")}: ${recipient}\n${localize("Subject", "الموضوع")}: ${subject}\n\n${body}`;
      fallback.hidden = false;
      copyStatus.textContent = "";
      status.textContent = localize(
        "Your draft is ready. Review and send it in your email app, or copy it below.",
        "مسودتك جاهزة. راجعها وأرسلها من تطبيق البريد، أو انسخها أدناه."
      );
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    },
    { signal }
  );

  form.querySelector("#tq-copy")?.addEventListener(
    "click",
    async () => {
      const preparedDraft = draft.value;
      try {
        if (!navigator.clipboard?.writeText)
          throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(preparedDraft);
        if (!signal.aborted && draft.value === preparedDraft)
          copyStatus.textContent = localize(
            "Draft copied. Paste it into your email app to send.",
            "تم نسخ المسودة. ألصقها في تطبيق البريد الإلكتروني لإرسالها."
          );
      } catch {
        if (signal.aborted || draft.value !== preparedDraft) return;
        draft.focus();
        draft.select();
        copyStatus.textContent = localize(
          "Copy is unavailable in this browser. The draft is selected; use your device’s Copy command.",
          "النسخ غير متاح في هذا المتصفح. تم تحديد المسودة؛ استخدم أمر النسخ على جهازك."
        );
      }
    },
    { signal }
  );
  return clean;
}
