import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/features/catalogue/components/breadcrumbs";
import { ContactBanner } from "@/features/landing/contact-banner";
import { company } from "@/features/catalogue/catalogue";
import { pageMetadata } from "@/features/catalogue/metadata";
import "@/features/landing/editorial-inner.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Website.about" });
  return pageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/about",
    locale,
  });
}

export default async function AboutPage() {
  const t = await getTranslations("Website.about");
  const site = await getTranslations("Website");
  const locale = await getLocale();
  const copy =
    locale === "ar"
      ? {
          title: "تجارة وتوزيع. من دبي.",
          company: "سليمان فاروق للتجارة العامة ذ.م.م.",
          established: "تأسست في دبي",
          base: "مكتبنا ومستودعنا",
          baseName: "القصيص",
          divisions: "مجالا عمل. شركة واحدة.",
          toshiba: "منتجات توشيبا",
          toshibaText:
            "بطاريات وإضاءة LED لتجار التجزئة والجملة وشركاء التوزيع.",
          commodities: "السلع والتوريدات التجارية",
          commoditiesText:
            "سلع غذائية ومواد كيميائية ومواد بناء وتوريدات للضيافة.",
          portfolio: "مجالات أعمالنا",
          principles: "كيف نعمل",
          customers: "أسواق عملائنا",
          marketNote: "أسواق نشاطنا في توزيع منتجات توشيبا.",
          address:
            "مكتب ومستودع رقم 7، القصيص الصناعية 1، بالقرب من وزارة العمل",
          browse: "استكشف المنتجات",
        }
      : {
          title: "Trading & distribution.\nFrom Dubai.",
          company: company.name,
          established: "Established in Dubai",
          base: "Office & warehouse",
          baseName: "Al-Qusais",
          divisions: "Two divisions.\nOne company.",
          toshiba: "Toshiba products",
          toshibaText:
            "Batteries and LED lighting for retailers, wholesalers and distribution partners.",
          commodities: "Commodities & commercial supplies",
          commoditiesText:
            "Food commodities, chemicals, construction materials and hospitality supplies.",
          portfolio: "Our business",
          principles: "How we work",
          customers: "Our customer markets",
          marketNote:
            "Markets served through our Toshiba distribution activity.",
          address: company.address,
          browse: "Explore products",
        };
  const markets = ["gcc", "yemen", "india", "bangladesh"];
  return (
    <>
      <div className="editorial-inner editorial-about site-container">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: site("nav.home"), href: "/" },
            { label: site("nav.about") },
          ]}
        />
        <header className="ei-hero ei-profile-hero">
          <div>
            <p className="ei-kicker">{site("nav.about")}</p>
            <h1>{copy.title}</h1>
            <p className="ei-intro">{t("intro")}</p>
          </div>
          <aside className="ei-company-record" aria-label={copy.company}>
            <p className="ei-record-company">{copy.company}</p>
            <dl>
              <div>
                <dt>{copy.established}</dt>
                <dd className="ei-year" dir="ltr">
                  2013
                </dd>
              </div>
              <div>
                <dt>{copy.base}</dt>
                <dd>{copy.baseName}</dd>
              </div>
            </dl>
            <address>
              {copy.address}
              <br />
              {site("design.locationShort")}
            </address>
          </aside>
        </header>
        <section
          className="ei-divisions"
          aria-labelledby="about-divisions"
          data-reveal
        >
          <div className="ei-section-heading">
            <p className="ei-kicker">{copy.portfolio}</p>
            <h2 id="about-divisions">{copy.divisions}</h2>
            <p>{t("whatText")}</p>
          </div>
          <div className="ei-division-grid">
            <article className="ei-division">
              <Link
                href="/products/batteries"
                className="ei-division-image"
                aria-label={copy.toshiba}
              >
                <Image
                  src="/images/campaign/hero-dubai-v1.png"
                  width={1448}
                  height={1086}
                  alt={site("reference.heroImageAlt")}
                  sizes="(min-width: 900px) 46vw, 90vw"
                />
              </Link>
              <div className="ei-division-copy">
                <span className="ei-index" aria-hidden="true">
                  01
                </span>
                <div>
                  <h3>{copy.toshiba}</h3>
                  <p>{copy.toshibaText}</p>
                  <div className="ei-division-links">
                    <Link href="/products/batteries">
                      {locale === "ar" ? "البطاريات" : "Batteries"}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                    <Link href="/products/led-lighting">
                      {locale === "ar" ? "إضاءة LED" : "LED lighting"}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
            <article className="ei-division">
              <Link
                href="/products/commodities"
                className="ei-division-image ei-commodity-image"
                aria-label={copy.commodities}
              >
                <Image
                  src="/images/catalogue/7b45459197-sugrimg1.jpg"
                  width={800}
                  height={600}
                  alt={
                    locale === "ar"
                      ? "سكر أبيض من كتالوج السلع"
                      : "White sugar from the commodities catalogue"
                  }
                  sizes="(min-width: 900px) 46vw, 90vw"
                />
              </Link>
              <div className="ei-division-copy">
                <span className="ei-index" aria-hidden="true">
                  02
                </span>
                <div>
                  <h3>{copy.commodities}</h3>
                  <p>{copy.commoditiesText}</p>
                  <div className="ei-division-links">
                    <Link href="/products/commodities">
                      {copy.browse}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
        <section
          className="ei-market-section"
          data-reveal
          aria-labelledby="about-markets"
        >
          <div>
            <p className="ei-kicker">{site("marketFootprint.eyebrow")}</p>
            <h2 id="about-markets">{copy.customers}</h2>
            <p>{t("whoText")}</p>
          </div>
          <div className="ei-market-record">
            <ul>
              {markets.map((key) => (
                <li key={key}>
                  {site(`marketFootprint.${key}`)}
                  <span aria-hidden="true">↗</span>
                </li>
              ))}
            </ul>
            <p>{copy.marketNote}</p>
          </div>
        </section>
        <section
          className="ei-principles"
          data-reveal
          aria-labelledby="about-principles"
        >
          <p className="ei-kicker" id="about-principles">
            {copy.principles}
          </p>
          <div>
            {["values", "vision", "mission"].map((key, index) => (
              <article key={key}>
                <span className="ei-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <h2>{t(key)}</h2>
                <p>{t(`${key}Text`)}</p>
              </article>
            ))}
          </div>
          <Link href="/services" className="ei-text-link">
            {site("home.servicesLink")}
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </div>
      <ContactBanner />
    </>
  );
}
