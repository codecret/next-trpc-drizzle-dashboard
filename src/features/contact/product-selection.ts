/** Preserve an unfinished enquiry when a visitor selects additional products. */
export function mergeEnquiryProduct(current: string, selected: string): string {
  const products = current
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean);
  const incoming = selected.trim();
  if (incoming && !products.includes(incoming)) products.push(incoming);
  return products.join("; ");
}
