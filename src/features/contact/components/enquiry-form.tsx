"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  Copy,
  LoaderCircle,
  Mail,
  Plus,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createEnquirySchema,
  enquiryDivisions,
  type EnquiryDivision,
  type EnquiryValues,
} from "../types";
import { mergeEnquiryProduct } from "../product-selection";
import { mutationHandler } from "@/utils/mutationHandler";
import { toast } from "@/utils/use-toast";
import "./contact-page.css";

const optionalFields = [
  "company",
  "product",
  "quantity",
  "destination",
] as const;
const fieldLimits = {
  name: 100,
  email: 254,
  phone: 50,
  company: 150,
  product: 250,
  quantity: 250,
  destination: 150,
};

export function EnquiryForm({
  product = "",
  email,
  compact = false,
  deliveryEnabled = false,
  supplierHome = false,
  premiumHome = false,
}: {
  product?: string;
  email: string;
  compact?: boolean;
  deliveryEnabled?: boolean;
  supplierHome?: boolean;
  premiumHome?: boolean;
}) {
  const t = useTranslations("Website.contact");
  const ui = useTranslations("Website.inner");
  const id = useId();
  const detailsFields = premiumHome
    ? optionalFields.filter((field) => field !== "company")
    : optionalFields;
  const schema = createEnquirySchema({
    required: t("required"),
    invalidEmail: t("invalidEmail"),
    messageMin: t("messageMin"),
    maxLength: t("maxLength"),
  });
  const form = useForm<EnquiryValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      division: "",
      company: "",
      product,
      quantity: "",
      destination: "",
      message: "",
      website: "",
    },
  });
  const [detailsOpen, setDetailsOpen] = useState(Boolean(product));
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);
  const [selectionNotice, setSelectionNotice] = useState("");
  const panel = useRef<HTMLElement>(null);
  const selectedProduct = useWatch({ control: form.control, name: "product" });
  const successHeading = useRef<HTMLHeadingElement>(null);
  const submission = useRef<{ payload: string; requestId: string } | null>(
    null
  );
  const busy = form.formState.isSubmitting;

  useEffect(() => {
    if (sent) {
      panel.current?.scrollIntoView({ block: "start", behavior: "instant" });
      successHeading.current?.focus({ preventScroll: true });
    }
  }, [sent]);

  useEffect(() => {
    if (!supplierHome && !premiumHome) return;
    const root = panel.current?.closest(".supplier-home");
    if (!root) return;
    let frame = 0;
    const prefill = (event: Event) => {
      if (!(event instanceof MouseEvent) || !(event.target instanceof Element))
        return;
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
        event.altKey ||
        busy
      )
        return;
      event.preventDefault();
      if (window.location.hash !== "#quotation") {
        window.history.pushState(null, "", "#quotation");
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
      const division = link.dataset.enquiryDivision as EnquiryDivision;
      const nextProduct = (link.dataset.enquiryProduct ?? "").trim();
      // A new selection starts a fresh enquiry after a completed submission.
      if (sent) {
        form.reset();
        submission.current = null;
        setSent(false);
      }
      if (enquiryDivisions.some((value) => value === division)) {
        form.setValue("division", division, { shouldDirty: true });
      }
      if (nextProduct) {
        form.setValue(
          "product",
          mergeEnquiryProduct(form.getValues("product"), nextProduct),
          {
            shouldDirty: true,
            shouldValidate: true,
          }
        );
        setDetailsOpen(true);
        setSelectionNotice(t("selectionAdded", { product: nextProduct }));
      } else {
        setSelectionNotice(t("divisionSelected"));
      }
      setDraft("");
      setCopyStatus("");
      setServerError("");
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const input =
          panel.current?.querySelector<HTMLInputElement>('[name="name"]');
        panel.current?.scrollIntoView({
          block: "start",
          behavior:
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
            root.getAttribute("data-motion") === "reduced"
              ? "instant"
              : "smooth",
        });
        input?.focus({ preventScroll: true });
      });
    };
    root.addEventListener("click", prefill);
    return () => {
      root.removeEventListener("click", prefill);
      cancelAnimationFrame(frame);
    };
  }, [supplierHome, premiumHome, form, t, busy, sent]);

  function prepare(values: EnquiryValues) {
    const subject = t("draftSubject", {
      product: values.product || t("draftFallback"),
    });
    const body = [
      `${t("name")}: ${values.name}`,
      `${t("email")}: ${values.email}`,
      ...(values.phone ? [`${t("phone")}: ${values.phone}`] : []),
      ...(values.division
        ? [`${t("division")}: ${t(`divisions.${values.division}`)}`]
        : []),
      ...optionalFields
        .filter((field) => values[field])
        .map((field) => `${t(field)}: ${values[field]}`),
      "",
      values.message,
    ].join("\n");
    setDraft(`${subject}\n\n${body}`);
    setCopyStatus("");
    window.location.assign(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  }

  async function submit(values: EnquiryValues) {
    setServerError("");
    if (!deliveryEnabled) {
      prepare(values);
      return;
    }
    const payload = JSON.stringify(values);
    // Reuse the key when retrying an unchanged enquiry after a lost response.
    if (submission.current?.payload !== payload) {
      submission.current = { payload, requestId: crypto.randomUUID() };
    }
    const requestId = submission.current.requestId;
    const adaptedToast = {
      success: (message: string) => toast({ title: message }),
      error: (message: string) =>
        toast({ title: message, variant: "destructive" }),
    };
    await mutationHandler(
      async () => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 25000);
        try {
          const response = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, requestId }),
            signal: controller.signal,
          });
          const result: { success?: boolean; error?: string } | null =
            await response.json().catch(() => null);
          if (!response.ok || result?.success !== true) {
            throw new Error(
              result?.error === "RATE_LIMITED"
                ? "RATE_LIMITED"
                : "DELIVERY_FAILED"
            );
          }
        } finally {
          window.clearTimeout(timeout);
        }
      },
      {
        onSuccess: () => {
          setSent(true);
          setDraft("");
        },
        onError: (error) => {
          const message =
            error instanceof Error && error.message === "RATE_LIMITED"
              ? t("rateLimited")
              : t("sendFailed");
          setServerError(message);
          adaptedToast.error(message);
        },
      },
      adaptedToast
    );
  }

  function field(
    name: "name" | "email" | "phone" | (typeof optionalFields)[number]
  ) {
    const required = name === "name" || name === "email";
    const error = form.formState.errors[name];
    return (
      <div key={name}>
        <label
          htmlFor={`${id}-${name}`}
          className="mb-2 block text-sm font-medium"
        >
          {t(name)}
          {required && " *"}
        </label>
        <Input
          id={`${id}-${name}`}
          type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
          autoComplete={
            name === "name"
              ? "name"
              : name === "email"
                ? "email"
                : name === "phone"
                  ? "tel"
                  : name === "company"
                    ? "organization"
                    : "off"
          }
          {...form.register(name)}
          required={required}
          maxLength={fieldLimits[name]}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error-${name}` : undefined}
          className="bg-background"
        />
        {error && (
          <p
            id={`${id}-error-${name}`}
            role="alert"
            className="mt-2 text-xs text-destructive"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <section
      ref={panel}
      className={`enquiry-panel${compact ? " enquiry-panel-compact" : ""}${supplierHome ? " supplier-enquiry" : ""}${premiumHome ? " premium-enquiry" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      {sent ? (
        <div className="enquiry-success" role="status">
          <Check aria-hidden="true" />
          <h2 id={`${id}-title`} ref={successHeading} tabIndex={-1}>
            {t("sendSuccessTitle")}
          </h2>
          <p>{t("sendSuccessBody", { email: form.getValues("email") })}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setSent(false);
              setDetailsOpen(Boolean(product));
              setSelectionNotice("");
              submission.current = null;
            }}
          >
            {t("anotherEnquiry")}
            <ArrowRight className="ms-3 size-4" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <>
          <div className={compact ? "sr-only" : "enquiry-panel-heading"}>
            {!compact && (
              <span className="enquiry-icon">
                <Mail aria-hidden="true" />
              </span>
            )}
            <h2 id={`${id}-title`}>
              {deliveryEnabled ? t("sendFormTitle") : t("formTitle")}
            </h2>
          </div>
          <p className="enquiry-intro">
            {deliveryEnabled ? t("sendFormIntro") : t("formIntro")}
          </p>
          <p className="enquiry-required">{ui("requiredFields")}</p>
          <form
            method="post"
            action="/api/enquiry"
            onChange={() => {
              if (draft) {
                setDraft("");
                setCopyStatus("");
              }
            }}
            onSubmit={(event) => {
              void form.handleSubmit(submit, (errors) => {
                const invalid = detailsFields.find((name) => errors[name]);
                if (invalid) {
                  setDetailsOpen(true);
                  requestAnimationFrame(() => form.setFocus(invalid));
                }
              })(event);
            }}
            noValidate
          >
            <fieldset
              disabled={busy}
              className="enquiry-fields"
              aria-busy={busy}
            >
              {(supplierHome || premiumHome) && (
                <div>
                  <label
                    htmlFor={`${id}-division`}
                    className="mb-2 block text-sm font-medium"
                  >
                    {t("division")}
                  </label>
                  <select id={`${id}-division`} {...form.register("division")}>
                    <option value="">{t("divisionPlaceholder")}</option>
                    {enquiryDivisions.map((division) => (
                      <option key={division} value={division}>
                        {t(`divisions.${division}`)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedProduct && (
                <div className="enquiry-product-context">
                  <div>
                    <span>{t("selectedProduct")}</span>
                    <strong>{selectedProduct}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      form.setValue("product", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setSelectionNotice(t("selectionRemoved"));
                    }}
                    aria-label={t("removeProduct")}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
              <p
                className="sr-only enquiry-selection-notice"
                role="status"
                aria-live="polite"
              >
                {selectionNotice}
              </p>
              {premiumHome ? (
                <>
                  <div className="enquiry-field-grid">
                    {field("name")}
                    {field("company")}
                  </div>
                  <div className="enquiry-field-grid">
                    {field("email")}
                    {field("phone")}
                  </div>
                </>
              ) : (
                <div className="enquiry-field-grid">
                  {field("name")}
                  {field("email")}
                </div>
              )}
              <div>
                <label
                  htmlFor={`${id}-message`}
                  className="mb-2 block text-sm font-medium"
                >
                  {t("message")} *
                </label>
                <textarea
                  id={`${id}-message`}
                  {...form.register("message")}
                  rows={compact ? 4 : 5}
                  required
                  maxLength={3000}
                  aria-invalid={Boolean(form.formState.errors.message)}
                  aria-describedby={
                    form.formState.errors.message
                      ? `${id}-error-message`
                      : undefined
                  }
                  placeholder={t("messagePlaceholder")}
                  className="w-full resize-y rounded-md border bg-background px-3 py-3 text-sm leading-6 placeholder:text-muted-foreground"
                />
                {form.formState.errors.message && (
                  <p
                    id={`${id}-error-message`}
                    role="alert"
                    className="mt-2 text-xs text-destructive"
                  >
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>
              <details
                className="enquiry-order-details"
                open={detailsOpen}
                onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
              >
                <summary>
                  <span>{t("optionalDetails")}</span>
                  <Plus aria-hidden="true" />
                </summary>
                <div className="enquiry-field-grid">
                  {detailsFields.map(field)}
                </div>
              </details>
              <div className="enquiry-honeypot" aria-hidden="true">
                <label htmlFor={`${id}-website`}>Website</label>
                <input
                  id={`${id}-website`}
                  {...form.register("website")}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <p className="enquiry-privacy">
                {deliveryEnabled ? t("sendPrivacy") : t("privacy")}
              </p>
              {serverError && (
                <p role="alert" className="enquiry-error">
                  {serverError}
                </p>
              )}
              <div className="enquiry-submit-actions">
                <Button type="submit" className="site-button">
                  {busy
                    ? t("sending")
                    : deliveryEnabled
                      ? t("sendSubmit")
                      : t("submit")}
                  {busy ? (
                    <LoaderCircle
                      className="ml-4 size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowRight className="ms-4 size-4" aria-hidden="true" />
                  )}
                </Button>
                {serverError && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={form.handleSubmit(prepare)}
                  >
                    {t("emailInstead")}
                  </Button>
                )}
              </div>
            </fieldset>
          </form>
        </>
      )}
      {draft && (
        <div className="enquiry-draft">
          <p role="status">{t("draftReady")}</p>
          <pre>{draft}</pre>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(draft);
                setCopyStatus(t("copied"));
              } catch {
                setCopyStatus(t("copyFailed"));
              }
            }}
          >
            <Copy className="mr-2 size-4" aria-hidden="true" />
            {t("copy")}
          </Button>
          {copyStatus && <p role="status">{copyStatus}</p>}
        </div>
      )}
      <a href={`mailto:${email}`} className="enquiry-direct-link">
        {t("direct")} · {email}
      </a>
    </section>
  );
}
