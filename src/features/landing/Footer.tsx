import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("HomePage");

  const sections = [
    {
      title: t("footer.sections.product.title"),
      links: [
        { name: t("footer.sections.product.links.overview"), href: "#" },
        { name: t("footer.sections.product.links.pricing"), href: "#" },
        { name: t("footer.sections.product.links.marketplace"), href: "#" },
        { name: t("footer.sections.product.links.features"), href: "#" },
      ],
    },
    {
      title: t("footer.sections.company.title"),
      links: [
        { name: t("footer.sections.company.links.about"), href: "#" },
        { name: t("footer.sections.company.links.team"), href: "#" },
        { name: t("footer.sections.company.links.blog"), href: "#" },
        { name: t("footer.sections.company.links.careers"), href: "#" },
      ],
    },
    {
      title: t("footer.sections.resources.title"),
      links: [
        { name: t("footer.sections.resources.links.help"), href: "#" },
        { name: t("footer.sections.resources.links.sales"), href: "#" },
        { name: t("footer.sections.resources.links.advertise"), href: "#" },
        { name: t("footer.sections.resources.links.privacy"), href: "#" },
      ],
    },
  ];

  return (
    <section className="py-32">
      <div className="container m-auto">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <Image
                    src="/freelogo.png"
                    alt={t("footer.logoAlt")}
                    width={44}
                    height={44}
                  />
                  <p className="text-3xl font-semibold">{t("footer.brand")}</p>
                </span>
                <p className="mt-6 text-sm text-muted-foreground">
                  {t("footer.description")}
                </p>
              </div>
              <ul className="flex items-center space-x-6 text-muted-foreground">
                <li className="font-medium hover:text-primary">
                  <Link href="#" aria-label={t("footer.social.instagram")}>
                    <FaInstagram className="size-6" />
                  </Link>
                </li>
                <li className="font-medium hover:text-primary">
                  <Link href="#" aria-label={t("footer.social.github")}>
                    <FaGithub className="size-6" />
                  </Link>
                </li>
                <li className="font-medium hover:text-primary">
                  <Link href="#" aria-label={t("footer.social.linkedin")}>
                    <FaLinkedin className="size-6" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-6 font-bold">{section.title}</h3>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className="font-medium hover:text-primary"
                      >
                        <Link href={link.href}>{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            <p>{t("footer.copyright", { year: "2025" })}</p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              <li className="hover:text-primary">
                <Link href="#">{t("footer.legal.terms")}</Link>
              </li>
              <li className="hover:text-primary">
                <Link href="#">{t("footer.legal.privacy")}</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
