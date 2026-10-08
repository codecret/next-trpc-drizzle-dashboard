"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import Form from "next/form";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, ChevronDown, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  CatalogueFamilySelect,
  CatalogueSortSelect,
} from "./catalogue-filter-select";

type Range = {
  name: string;
  count?: number;
  href: string;
  selected: boolean;
  level?: number;
};

export function BatteryRangeNavigation({ ranges }: { ranges: Range[] }) {
  const t = useTranslations("Website.batteries");
  const [expanded, setExpanded] = useState(false);
  const selected = ranges.find((range) => range.selected) ?? ranges[0];

  return (
    <nav className="battery-ranges" aria-label={t("rangeLabel")}>
      <h2 className="battery-range-heading">{t("rangeLabel")}</h2>
      <button
        type="button"
        className="battery-range-toggle"
        aria-expanded={expanded}
        aria-controls="battery-range-list"
        onClick={() => setExpanded(!expanded)}
      >
        <span>
          <span>{t("rangeLabel")}</span>
          <strong>{selected.name}</strong>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <ul id="battery-range-list" className={expanded ? "is-expanded" : ""}>
        {ranges.map((range) => (
          <li key={range.href}>
            <Link
              href={range.href}
              aria-current={range.selected ? "page" : undefined}
              data-level={range.level ?? 0}
              onClick={() => setExpanded(false)}
            >
              <span className="battery-range-indicator" aria-hidden="true">
                {range.selected && <Check size={10} strokeWidth={3} />}
              </span>
              <span className="battery-range-name">{range.name}</span>
              <span className="battery-range-count">
                {range.count ?? <ArrowRight size={13} aria-hidden="true" />}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function BatterySearch({
  action,
  search,
  category,
  sort,
  heading,
  countLabel,
  searchLabel,
  searchPlaceholder,
  family,
  families = [],
}: {
  action: string;
  search: string;
  category?: string;
  sort?: string;
  heading: string;
  countLabel: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  family?: string;
  families?: string[];
}) {
  const t = useTranslations("Website.batteries");
  const catalogue = useTranslations("Website.catalogue");
  const formRef = useRef<HTMLFormElement>(null);
  const sourceKey = JSON.stringify([search, category, sort, family]);
  const [fields, setFields] = useState({
    sourceKey,
    search,
    sort: sort === "name" ? "name" : "",
    family: family ?? "",
  });
  // Sync back/forward and filter links without replacing the focused controls.
  if (fields.sourceKey !== sourceKey) {
    setFields({
      sourceKey,
      search,
      sort: sort === "name" ? "name" : "",
      family: family ?? "",
    });
  }

  function applyFilter(key: "family" | "sort", value: string) {
    // Custom controls must update their hidden form values before submission.
    flushSync(() => setFields((current) => ({ ...current, [key]: value })));
    formRef.current?.requestSubmit();
  }

  return (
    <Form
      ref={formRef}
      action={action}
      scroll={false}
      className="battery-search-form"
    >
      {category && <input type="hidden" name="category" value={category} />}
      <label className="sr-only" htmlFor="battery-search">
        {searchLabel ?? t("searchLabel")}
      </label>
      <div className="battery-search-bar">
        <Search size={19} aria-hidden="true" />
        <input
          id="battery-search"
          name="q"
          type="search"
          value={fields.search}
          onChange={(event) =>
            setFields({ ...fields, search: event.target.value })
          }
          maxLength={160}
          placeholder={searchPlaceholder ?? t("searchPlaceholder")}
        />
        <button type="submit">
          <span>{catalogue("search")}</span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="battery-results-heading" id="catalogue-results">
        <div>
          <h2>{heading}</h2>
          <p role="status" aria-live="polite" aria-atomic="true">
            {countLabel}
          </p>
        </div>
        <div className="catalogue-selects">
          {families.length > 0 && (
            <>
              <input type="hidden" name="family" value={fields.family} />
              <CatalogueFamilySelect
                value={fields.family}
                families={families}
                onValueChange={(value) => applyFilter("family", value)}
              />
            </>
          )}
          <input type="hidden" name="sort" value={fields.sort} />
          <CatalogueSortSelect
            value={fields.sort}
            onValueChange={(value) => applyFilter("sort", value)}
          />
        </div>
      </div>
    </Form>
  );
}
