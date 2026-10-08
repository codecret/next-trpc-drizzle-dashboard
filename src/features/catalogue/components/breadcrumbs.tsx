import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { absoluteUrl } from "../metadata";
import { JsonLd } from "./json-ld";

export function Breadcrumbs({
  items,
  locale,
}: {
  items: { label: string; href?: string }[];
  locale: string;
}) {
  return (
    <>
      <nav
        aria-label={locale === "de" ? "Brotkrümelnavigation" : "Breadcrumb"}
        className="mb-7 text-xs text-muted-foreground sm:text-sm"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {index > 0 && (
                <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href ? { item: absoluteUrl(item.href, locale) } : {}),
          })),
        }}
      />
    </>
  );
}
