import { ancestorsOf, categoryBySlug, localize, products } from "./catalogue";
import type { CatalogueQuery } from "./components/catalogue-browser";

const pageSize = 12;

function batteryCategory(slug?: string) {
  const category = categoryBySlug.get(slug ?? "");
  return category &&
    ancestorsOf(category).some((ancestor) => ancestor.slug === "batteries")
    ? category
    : undefined;
}

export function getBatteryCatalogue(query: CatalogueQuery, locale: string) {
  const search = (query.q ?? "").trim().slice(0, 160);
  const selectedCategory = batteryCategory(query.category);
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = products.filter((product) => {
    if (!product.categoryPath.includes("batteries")) return false;
    if (
      selectedCategory &&
      !product.categoryPath.includes(selectedCategory.slug)
    )
      return false;

    const searchableText = [
      product.name,
      product.productCode,
      product.sfgtCode,
      product.family,
      ...product.categoryPath.map((slug) =>
        localize(categoryBySlug.get(slug)!.name, locale)
      ),
      ...product.sourceCategories,
      ...product.tables.flatMap((table) => table.rows.flat()),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => searchableText.includes(term));
  });

  if (query.sort === "name")
    filtered.sort((a, b) => a.name.localeCompare(b.name, locale));

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requestedPage = Number(query.page);
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;

  return {
    search,
    selectedCategory,
    filtered,
    pageProducts: filtered.slice((page - 1) * pageSize, page * pageSize),
    page,
    totalPages,
    pageSize,
    hasFilters: Boolean(search || selectedCategory || query.sort === "name"),
  };
}

export function batteryCatalogueHref(
  query: CatalogueQuery,
  overrides: Partial<CatalogueQuery> = {}
) {
  const next = { ...query, ...overrides };
  const search = (next.q ?? "").trim().slice(0, 160);
  const category = batteryCategory(next.category);
  const requestedPage = Number(next.page);
  const params = new URLSearchParams();

  if (search) params.set("q", search);
  if (category) params.set("category", category.slug);
  if (next.sort === "name") params.set("sort", "name");
  if (Number.isSafeInteger(requestedPage) && requestedPage > 1)
    params.set("page", String(requestedPage));

  return "/products/batteries" + (params.size ? "?" + params.toString() : "");
}
