"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./catalogue-filter-select.css";

type FilterProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function CatalogueFamilySelect({
  value,
  families,
  onValueChange,
}: FilterProps & { families: string[] }) {
  const t = useTranslations("Website.catalogue");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  function changeOpen(next: boolean) {
    setOpen(next);
    setQuery("");
  }
  const options = [
    { value: "", label: t("allFamilies") },
    ...[...families]
      .sort((a, b) => a.localeCompare(b, locale))
      .map((family) => ({ value: family, label: family })),
  ];

  return (
    <div className="battery-sort catalogue-family-filter">
      <label id="catalogue-family-label" htmlFor="catalogue-family">
        {t("family")}
      </label>
      <Popover open={open} onOpenChange={changeOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id="catalogue-family"
            className="catalogue-filter-trigger"
            aria-labelledby="catalogue-family-label catalogue-family-value"
            data-filtered={Boolean(value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                changeOpen(true);
              }
            }}
          >
            <span id="catalogue-family-value">{value || t("allFamilies")}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="public-surface catalogue-family-menu"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          aria-label={t("family")}
        >
          <Command defaultValue={value || t("allFamilies")} loop>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={t("searchFamilies")}
              aria-label={t("searchFamilies")}
              autoComplete="off"
              spellCheck={false}
            />
            <CommandList label={t("family")}>
              <CommandEmpty role="status">{t("noFamilies")}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-current={value === option.value}
                    onSelect={() => {
                      changeOpen(false);
                      if (value !== option.value) onValueChange(option.value);
                    }}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Check size={16} aria-hidden="true" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function CatalogueSortSelect({ value, onValueChange }: FilterProps) {
  const t = useTranslations("Website.catalogue");

  return (
    <div className="battery-sort catalogue-sort-filter">
      <label id="battery-sort-label" htmlFor="battery-sort">
        {t("sort")}
      </label>
      <Select
        value={value || "source"}
        onValueChange={(next) => onValueChange(next === "source" ? "" : next)}
      >
        <SelectTrigger
          id="battery-sort"
          className="catalogue-filter-trigger"
          aria-labelledby="battery-sort-label battery-sort-value"
          data-filtered={Boolean(value)}
        >
          <SelectValue id="battery-sort-value">
            {value === "name" ? t("nameAsc") : t("sourceOrder")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className="public-surface catalogue-sort-menu"
          align="end"
          sideOffset={4}
          collisionPadding={16}
        >
          <SelectItem value="source">{t("sourceOrder")}</SelectItem>
          <SelectItem value="name">{t("nameAsc")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
