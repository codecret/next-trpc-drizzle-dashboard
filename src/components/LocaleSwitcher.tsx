"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Website.nav");
  const pathname = usePathname();
  const router = useRouter();
  return (
    <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("language")}>
          {locale === "ar" ? "العربية" : "EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((language) => (
          <DropdownMenuCheckboxItem
            key={language}
            checked={locale === language}
            lang={language}
            dir={language === "ar" ? "rtl" : "ltr"}
            onCheckedChange={() =>
              router.replace(
                `${pathname}${window.location.search}${window.location.hash}`,
                {
                  locale: language,
                }
              )
            }
          >
            {language === "en" ? "English" : "العربية"}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
