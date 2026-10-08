import data from "./data/catalogue.json";
import type { Category, Download, LocalizedText, Product } from "./types";

export const categories: Category[] = data.categories;
export const products: Product[] = data.products;
export const downloads: Download[] = data.downloads;
export const brand = data.brand;
export const auditedAt = data.auditedAt;
export const categoryBySlug = new Map(
  categories.map((category) => [category.slug, category])
);
export const productBySlug = new Map(
  products.map((product) => [product.slug, product])
);
export const localize = (value: LocalizedText, locale: string) =>
  value[locale === "de" ? "de" : "en"];
export const childrenOf = (slug = "") =>
  categories.filter((category) => category.parent === slug);
export const productsIn = (slug: string) =>
  products.filter((product) => product.categoryPath.includes(slug));
export function ancestorsOf(category: Category): Category[] {
  const parent = categoryBySlug.get(category.parent);
  return parent ? [...ancestorsOf(parent), parent] : [];
}
export const company = {
  name: "Sulemane Faruk General Trading LLC",
  email: "tbts@sfgt-tbts.com",
  phone: "+971 4 336 4633",
  mobile: "+971 56 500 6024",
  whatsapp: "+971 50 342 0157",
  toshibaEmail: "toshibabts.gcc@toshibabts.com",
  toshibaAlternativeEmail: "toshibabts.gcc@gmail.com",
  address:
    "Office and Warehouse No. 7, Al-Qusais Industrial Area 1, near Ministry of Labour",
  city: "Dubai, United Arab Emirates",
  poBox: "122577",
};
