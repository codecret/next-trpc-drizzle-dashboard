import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

const Faq = () => {
  const t = useTranslations("HomePage");
  const faqs = [
    {
      question: t("faq.questions.what.question"),
      answer: t("faq.questions.what.answer"),
    },
    {
      question: t("faq.questions.why.question"),
      answer: t("faq.questions.why.answer"),
    },
    {
      question: t("faq.questions.how.question"),
      answer: t("faq.questions.how.answer"),
    },
    {
      question: t("faq.questions.benefits.question"),
      answer: t("faq.questions.benefits.answer"),
    },
  ];
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="text-center">
          <Badge className="text-xs font-medium">{t("faq.badge")}</Badge>
          <h1 className="mt-4 text-4xl font-semibold">{t("faq.title")}</h1>
          <p className="mt-6 font-medium text-muted-foreground">
            {t("faq.description")}
          </p>
        </div>
        <div className="mx-auto mt-14 max-w-screen-sm">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-8 flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
                {index + 1}
              </span>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">{faq.question}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Faq };
