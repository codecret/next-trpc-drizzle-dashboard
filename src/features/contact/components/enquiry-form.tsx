"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  Copy,
  LoaderCircle,
  Mail,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEnquirySchema, type EnquiryValues } from "../types";
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
}: {
  product?: string;
  email: string;
  compact?: boolean;
  deliveryEnabled?: boolean;
}) {
  const t = useTranslations("Website.contact");
  const ui = useTranslations("Website.inner");
  const id = useId();
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
  const successHeading = useRef<HTMLHeadingElement>(null);
  const submission = useRef<{ payload: string; requestId: string } | null>(
    null
  );
  const busy = form.formState.isSubmitting;

  useEffect(() => {
    if (sent) successHeading.current?.focus();
  }, [sent]);

  function prepare(values: EnquiryValues) {
    const subject = t("draftSubject", {
      product: values.product || t("draftFallback"),
    });
    const body = [
      `${t("name")}: ${values.name}`,
      `${t("email")}: ${values.email}`,
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

  function field(name: "name" | "email" | (typeof optionalFields)[number]) {
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
          type={name === "email" ? "email" : "text"}
          autoComplete={
            name === "name"
              ? "name"
              : name === "email"
                ? "email"
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
      className={`enquiry-panel${compact ? " enquiry-panel-compact" : ""}`}
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
            onSubmit={(event) => {
              void form.handleSubmit(submit, (errors) => {
                const invalid = optionalFields.find((name) => errors[name]);
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
              <div className="enquiry-field-grid">
                {field("name")}
                {field("email")}
              </div>
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
                  {optionalFields.map(field)}
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
