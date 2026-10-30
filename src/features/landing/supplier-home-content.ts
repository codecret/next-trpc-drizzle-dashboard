/** Extract complete fragments from our checked-in, generated HTML document.
 * Keeping the quotation section in React gives it server-rendered fields and a
 * single implementation shared with Contact. Do not accept user HTML here.
 */
export function splitSupplierHomeContent(html: string) {
  const main = html.match(
    /^([\s\S]*?)<main\b[^>]*>([\s\S]*?)<\/main>([\s\S]*)$/
  );
  if (!main) throw new Error("Supplier homepage is missing its main element");
  const quotation = main[2].match(
    /^([\s\S]*?)<section\b[^>]*\bid="quotation"[^>]*>([\s\S]*)<\/section>\s*$/
  );
  if (!quotation)
    throw new Error("Supplier homepage is missing its quotation section");
  const copy = quotation[2].match(
    /^\s*<div class="wrap quote-grid">\s*<div class="quote-copy">([\s\S]*?)<\/div>\s*(?:<form\b|<div\b[^>]*data-supplier-enquiry)/
  );
  if (!copy)
    throw new Error("Supplier homepage is missing its enquiry form slot");
  return {
    header: main[1],
    sections: quotation[1],
    quoteCopy: copy[1],
    footer: main[3],
  };
}
