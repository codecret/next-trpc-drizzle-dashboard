"use client";
import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import "./navigation-footer.css";
type Group = { title: string; href: string };
export function ProductSearch({ groups }: { groups: Group[] }) {
  const t = useTranslations("Website");
  const locale = useLocale();
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="header-search-button"
          aria-label={t("design.search")}
        >
          <Search className="size-[18px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="public-surface search-dialog">
        <DialogHeader className="search-dialog-heading">
          <p className="eyebrow">{t("catalogue.eyebrow")}</p>
          <DialogTitle className="search-dialog-title">
            {t("design.searchPrompt")}
          </DialogTitle>
          <DialogDescription className="search-dialog-description">
            {t("design.searchHint")}
          </DialogDescription>
        </DialogHeader>
        <form
          action={(locale === "de" ? "/de" : "") + "/products"}
          method="get"
          className="search-dialog-form"
        >
          <label htmlFor={id} className="sr-only">
            {t("catalogue.searchLabel")}
          </label>
          <input
            id={id}
            name="q"
            type="search"
            maxLength={160}
            placeholder={t("catalogue.searchPlaceholder")}
            className="search-dialog-input"
          />
          <Button
            type="submit"
            className="site-button search-dialog-submit"
            aria-label={t("catalogue.search")}
          >
            <ArrowRight className="size-5" />
          </Button>
        </form>
        <div className="search-category-list">
          {groups.map((group, index) => (
            <Link
              key={group.href}
              href={group.href}
              onClick={() => setOpen(false)}
              className="search-category"
            >
              <span className="index-number">0{index + 1}</span>
              <span>{group.title}</span>
              <ArrowRight className="size-4" />
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
