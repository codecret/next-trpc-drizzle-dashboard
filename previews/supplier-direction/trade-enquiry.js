(() => {
  "use strict";
  const form = document.querySelector("#preview-enquiry");
  if (!form || !form.classList.contains("tq-form")) return;

  const isArabic = document.documentElement.lang === "ar";
  const localize = (english, arabic) => (isArabic ? arabic : english);
  const field = (name) => form.elements.namedItem(name);
  const division = field("division");
  const product = field("product");
  const message = field("message");
  const orderDetails = form.querySelector("#tq-order");
  const status = form.querySelector("#tq-status");
  const fallback = form.querySelector("#tq-fallback");
  const draft = form.querySelector("#tq-draft");
  const copyStatus = form.querySelector("#tq-copy-status");
  const divisionNames = Object.fromEntries(
    [...division.options].map((option) => [
      option.value,
      option.textContent.trim(),
    ]),
  );
  const recipient = "tbts@sfgt-tbts.com";

  const validateMessage = () => {
    const length = message.value.trim().length;
    message.setCustomValidity(
      length < 10
        ? localize(
            "Please describe your enquiry in at least 10 characters.",
            "يرجى كتابة استفسارك في 10 أحرف على الأقل.",
          )
        : "",
    );
  };
  message.addEventListener("input", validateMessage);

  const invalidateDraft = (announce = true) => {
    if (fallback.hidden) return;
    fallback.hidden = true;
    draft.value = "";
    copyStatus.textContent = "";
    if (announce) {
      status.textContent = localize(
        "Your details have changed. Open a new email draft to include the latest information.",
        "تم تغيير التفاصيل. افتح مسودة بريد جديدة تتضمن أحدث المعلومات.",
      );
    }
  };
  const onDetailsEdited = (event) => {
    if (event.target instanceof Element && event.target.getAttribute("name")) {
      invalidateDraft();
    }
  };
  form.addEventListener("input", onDetailsEdited);
  form.addEventListener("change", onDetailsEdited);

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest(
      "a[data-enquiry-product], a[data-enquiry-division]",
    );
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    const selectedDivision = link.dataset.enquiryDivision;
    const selectedProduct = (link.dataset.enquiryProduct || "").trim();
    invalidateDraft(false);
    if (Object.hasOwn(divisionNames, selectedDivision)) {
      division.value = selectedDivision;
    }
    if (selectedProduct) {
      const existingProducts = product.value
        .split(";")
        .map((value) => value.trim());
      if (!existingProducts.includes(selectedProduct)) {
        product.value = product.value.trim()
          ? `${product.value.trim()}; ${selectedProduct}`
          : selectedProduct;
      }
      orderDetails.open = true;
      status.textContent = isArabic
        ? `تمت إضافة ⁦${selectedProduct}⁩ إلى استفسارك. تم الاحتفاظ بجميع التفاصيل التي أدخلتها.`
        : `${selectedProduct} added to your enquiry. Any details already entered are kept.`;
    } else if (Object.hasOwn(divisionNames, selectedDivision)) {
      status.textContent = isArabic
        ? `موضوع الاستفسار: ${divisionNames[selectedDivision]}. تم الاحتفاظ بجميع التفاصيل التي أدخلتها.`
        : `Enquiry set to ${divisionNames[selectedDivision]}. Any details already entered are kept.`;
    }
    const nextField =
      selectedProduct && !field("quantity").value
        ? field("quantity")
        : !field("name").value
          ? field("name")
          : message;
    window.requestAnimationFrame(() => {
      form.dispatchEvent(
        new CustomEvent("enquiry:prefilled", {
          detail: { product: selectedProduct, division: division.value },
        }),
      );
      nextField.focus({ preventScroll: true });
      nextField.scrollIntoView({ behavior: "instant", block: "center" });
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validateMessage();
    if (!form.reportValidity()) return;

    const read = (name) => String(field(name).value || "").trim();
    const enquiryType = divisionNames[division.value] || divisionNames.toshiba;
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
    for (const [name, label] of optionalFields) {
      if (read(name)) lines.push(`${label}: ${read(name)}`);
    }
    lines.push(
      "",
      localize("Enquiry details:", "تفاصيل الاستفسار:"),
      read("message"),
    );
    const body = lines.join("\n");
    draft.value = `${localize("To", "إلى")}: ${recipient}\n${localize("Subject", "الموضوع")}: ${subject}\n\n${body}`;
    fallback.hidden = false;
    copyStatus.textContent = "";
    status.textContent = localize(
      "Your draft is ready. Review and send it in your email app, or copy it below.",
      "مسودتك جاهزة. راجعها وأرسلها من تطبيق البريد، أو انسخها أدناه.",
    );
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  form.querySelector("#tq-copy").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(draft.value);
      copyStatus.textContent = localize(
        "Draft copied. Paste it into your email app to send.",
        "تم نسخ المسودة. ألصقها في تطبيق البريد الإلكتروني لإرسالها.",
      );
    } catch {
      draft.focus();
      draft.select();
      copyStatus.textContent = localize(
        "Copy is unavailable in this browser. The draft is selected; use your device’s Copy command.",
        "النسخ غير متاح في هذا المتصفح. تم تحديد المسودة؛ استخدم أمر النسخ على جهازك.",
      );
    }
  });
})();
