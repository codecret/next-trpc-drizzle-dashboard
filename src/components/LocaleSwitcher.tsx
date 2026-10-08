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

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Website.nav");
  const pathname = usePathname();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("language")}>
          {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {["en", "de"].map((language) => (
          <DropdownMenuCheckboxItem
            key={language}
            checked={locale === language}
            onCheckedChange={() =>
              router.replace(`${pathname}${window.location.search}`, {
                locale: language,
              })
            }
          >
            {language === "en" ? "English" : "Deutsch"}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
