import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import "./market-footprint.css";

export async function MarketFootprint() {
  const t = await getTranslations("Website.marketFootprint");
  const markets = ["gcc", "yemen", "india", "bangladesh"] as const;

  return (
    <figure className="market-footprint">
      <div className="market-footprint-heading">
        <p>{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
      </div>
      <div className="market-footprint-diagram">
        <div className="market-footprint-base">
          <span className="market-footprint-label">{t("baseLabel")}</span>
          <span className="market-footprint-pin" aria-hidden="true">
            <MapPin />
          </span>
          <strong>{t("base")}</strong>
          <span className="market-footprint-country">{t("baseCountry")}</span>
        </div>
        <div className="market-footprint-markets">
          <p className="market-footprint-label">{t("marketsLabel")}</p>
          <ul role="list">
            {markets.map((market) => (
              <li key={market}>
                <span>{t(market)}</span>
                {market === "gcc" && <small>{t("gccDetail")}</small>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption>
        <span aria-hidden="true" />
        {t("caption")}
      </figcaption>
    </figure>
  );
}
