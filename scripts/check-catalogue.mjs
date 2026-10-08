import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const read = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const data = read("src/features/catalogue/data/catalogue.json");
const inventory = read("docs/source-audit/source-inventory.json");
const specifications = read("docs/source-audit/original-specifications.json");
const mapping = read("docs/source-audit/route-map.json");
const assets = read("docs/source-audit/asset-manifest.json");
const paths = new Set([
  "/",
  "/about",
  "/services",
  "/support",
  "/contact",
  "/products",
  ...[...data.categories, ...data.products].map(
    (item) => `/products/${item.slug}`
  ),
]);
assert.equal(data.products.length, 206);
assert.equal(
  new Set([...data.categories, ...data.products].map((item) => item.slug)).size,
  data.categories.length + data.products.length,
  "Category/product slugs must not collide"
);
assert.deepEqual(
  ["batteries", "led-lighting", "commodities"].map(
    (division) =>
      data.products.filter((product) => product.division === division).length
  ),
  [82, 65, 59]
);
for (const source of inventory) {
  assert.ok(mapping[source.url], `Missing source route mapping: ${source.url}`);
  assert.ok(
    paths.has(mapping[source.url].split("#")[0]),
    `Invalid source destination: ${source.url}`
  );
  if (
    /^https:\/\/www.toshibabts.com\/(ProductDetails|ledlightDetails)\.aspx/.test(
      source.url
    )
  ) {
    assert.equal(
      data.products.filter((product) => product.sources.includes(source.url))
        .length,
      1,
      `Source product must map exactly once: ${source.url}`
    );
  }
}
const normalizeCell = (value) =>
  value.replaceAll(",", "").replaceAll(/\s/g, "");
for (const original of specifications) {
  const product = data.products.find((product) =>
    product.sources.includes(original.url)
  );
  assert.ok(product, `Missing original product: ${original.url}`);
  for (const table of original.tables) {
    assert.ok(
      product.tables.some(
        (candidate) =>
          JSON.stringify(candidate.headers) === JSON.stringify(table.headers) &&
          JSON.stringify(
            candidate.rows.map((row) => row.map(normalizeCell))
          ) === JSON.stringify(table.rows.map((row) => row.map(normalizeCell)))
      ),
      `Lost or altered source specifications: ${original.url}`
    );
  }
}
for (const product of data.products) {
  assert.ok(
    product.name && product.images.length && product.sources.length,
    `Incomplete product: ${product.id}`
  );
  assert.ok(product.categoryPath.includes(product.category));
  for (const category of product.categoryPath)
    assert.ok(data.categories.some((item) => item.slug === category));
  for (const src of product.images) {
    assert.ok(
      existsSync(new URL(`../public${src}`, import.meta.url)),
      `Missing local image: ${src}`
    );
    assert.ok(
      assets.some(
        (asset) =>
          asset.path === src && product.imageSources.includes(asset.source)
      ),
      `Image lacks source provenance: ${product.id}`
    );
  }
  for (const id of product.downloads)
    assert.ok(data.downloads.some((download) => download.id === id));
}
for (const category of data.categories) {
  assert.equal(
    category.productCount,
    data.products.filter((product) =>
      product.categoryPath.includes(category.slug)
    ).length
  );
  if (category.parent)
    assert.ok(data.categories.some((item) => item.slug === category.parent));
}
for (const download of read("docs/source-audit/download-checksums.json")) {
  const file = readFileSync(
    new URL(`../public/downloads/${download.file}`, import.meta.url)
  );
  assert.equal(
    createHash("sha256").update(file).digest("hex"),
    download.sha256,
    "Original download must remain unchanged"
  );
}
const keys = (object, prefix = "") =>
  Object.entries(object)
    .flatMap(([key, value]) =>
      typeof value === "object"
        ? keys(value, `${prefix}${key}.`)
        : `${prefix}${key}`
    )
    .sort();
assert.deepEqual(
  keys(read("messages/en.json")),
  keys(read("messages/de.json")),
  "Locale keys must match"
);
process.stdout.write(
  `Verified ${data.products.length} products, ${specifications.length} source specification records, ${data.categories.length} categories, ${inventory.length} source mappings, image provenance, four unchanged PDFs and translation parity.\n`
);
