"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { ArrowRight, Copy, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EnquiryForm({
  product = "",
  email,
}: {
  product?: string;
  email: string;
}) {
  const t = useTranslations("Website.contact");
  const ui = useTranslations("Website.inner");
  const schema = z.object({
    name: z.string().trim().min(1, t("required")).max(100, t("maxLength")),
    email: z.string().trim().email(t("invalidEmail")).max(254, t("maxLength")),
    company: z.string().trim().max(150, t("maxLength")),
    product: z.string().trim().max(250, t("maxLength")),
    quantity: z.string().trim().max(250, t("maxLength")),
    message: z
      .string()
      .trim()
      .min(10, t("messageMin"))
      .max(3000, t("maxLength")),
  });
  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      product,
      quantity: "",
      message: "",
    },
  });
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  function prepare(values: Values) {
    const subject = t("draftSubject", {
      product: values.product || t("draftFallback"),
    });
    const body = [
      `${t("name")}: ${values.name}`,
      `${t("email")}: ${values.email}`,
      `${t("company")}: ${values.company}`,
      `${t("product")}: ${values.product}`,
      `${t("quantity")}: ${values.quantity}`,
      "",
      values.message,
    ].join("\n");
    setDraft(`${subject}\n\n${body}`);
    setCopyStatus("");
    window.location.assign(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  }
  return (
    <section className="enquiry-panel" aria-labelledby="enquiry-title">
      <div className="enquiry-panel-heading">
        <span className="enquiry-icon">
          <Mail aria-hidden="true" />
        </span>
        <h2 id="enquiry-title">{t("formTitle")}</h2>
      </div>
      <p className="enquiry-intro">{t("formIntro")}</p>
      <p className="enquiry-required">{ui("requiredFields")}</p>
      <form
        onSubmit={form.handleSubmit(prepare)}
        noValidate
        className="enquiry-fields"
      >
        <div className="enquiry-field-grid">
          {(["name", "email", "company", "product", "quantity"] as const).map(
            (field) => (
              <div
                key={field}
                className={field === "company" ? "enquiry-field-wide" : ""}
              >
                <label
                  htmlFor={`enquiry-${field}`}
                  className="mb-2 block text-sm font-medium"
                >
                  {t(field)}
                  {(field === "name" || field === "email") && " *"}
                </label>
                <Input
                  id={`enquiry-${field}`}
                  type={field === "email" ? "email" : "text"}
                  autoComplete={
                    field === "name"
                      ? "name"
                      : field === "email"
                        ? "email"
                        : field === "company"
                          ? "organization"
                          : "off"
                  }
                  {...form.register(field)}
                  required={field === "name" || field === "email"}
                  aria-invalid={Boolean(form.formState.errors[field])}
                  aria-describedby={
                    form.formState.errors[field] ? `error-${field}` : undefined
                  }
                  className="bg-background"
                />
                {form.formState.errors[field] && (
                  <p
                    id={`error-${field}`}
                    className="mt-2 text-xs text-destructive"
                  >
                    {form.formState.errors[field]?.message}
                  </p>
                )}
              </div>
            )
          )}
        </div>
        <div>
          <label
            htmlFor="enquiry-message"
            className="mb-2 block text-sm font-medium"
          >
            {t("message")} *
          </label>
          <textarea
            id="enquiry-message"
            {...form.register("message")}
            rows={5}
            required
            aria-invalid={Boolean(form.formState.errors.message)}
            aria-describedby={
              form.formState.errors.message ? "error-message" : undefined
            }
            placeholder={t("messagePlaceholder")}
            className="w-full resize-y rounded-md border bg-background px-3 py-3 text-sm leading-6 placeholder:text-muted-foreground"
          />
          {form.formState.errors.message && (
            <p id="error-message" className="mt-2 text-xs text-destructive">
              {form.formState.errors.message.message}
            </p>
          )}
        </div>
        <p className="text-xs leading-6 text-muted-foreground">
          {t("privacy")}
        </p>
        <Button type="submit" className="site-button w-full">
          {t("submit")}
          <ArrowRight className="ml-auto size-4" />
        </Button>
      </form>
      {draft && (
        <div className="mt-6 space-y-4 border-t pt-5">
          <p role="status" className="text-sm leading-6">
            {t("draftReady")}
          </p>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border bg-background p-4 text-xs leading-6">
            {draft}
          </pre>
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
            <Copy className="mr-2 size-4" />
            {t("copy")}
          </Button>
          {copyStatus && (
            <p role="status" className="text-xs">
              {copyStatus}
            </p>
          )}
        </div>
      )}
      <a
        href={`mailto:${email}`}
        className="mt-6 inline-block text-xs underline underline-offset-4"
      >
        {t("direct")} · {email}
      </a>
    </section>
  );
}
