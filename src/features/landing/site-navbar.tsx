"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ProductSearch } from "./product-search";
import "./navigation-footer.css";

type MenuGroup = {
  title: string;
  href: string;
  children: { title: string; href: string }[];
};
export function Navbar({
  logo,
  groups,
}: {
  logo: string;
  groups: MenuGroup[];
}) {
  const t = useTranslations("Website.nav");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const copy = isArabic
    ? {
        navigation: "التنقل الرئيسي",
        quote: "اطلب عرض سعر",
        ranges: "مجموعات المنتجات",
        tekbatt: "اكتشف Tekbatt",
        location: "دبي، الإمارات العربية المتحدة",
        language: "اللغة",
      }
    : {
        navigation: "Main navigation",
        quote: "Request a quote",
        ranges: "Product ranges",
        tekbatt: "Explore Tekbatt",
        location: "Dubai, United Arab Emirates",
        language: "Language",
      };
  const links = [
    { label: t("about"), href: "/about" },
    { label: t("services"), href: "/services" },
    { label: t("support"), href: "/support" },
  ];
  const logoLink = (
    <Link
      href="/"
      aria-label={`Sulemane Faruk General Trading LLC — ${t("home")}`}
      onClick={() => setOpen(false)}
      className="brand-logo"
    >
      <Image
        src={logo}
        width={190}
        height={56}
        alt="Sulemane Faruk General Trading LLC"
        priority
        className="brand-logo-image"
        sizes="(max-width: 639px) 132px, 176px"
      />
    </Link>
  );
  return (
    <header className="site-header sticky top-0 z-40">
      <a href="#main-content" className="site-skip-link">
        {t("skip")}
      </a>
      <div className="site-container site-header-inner">
        {logoLink}
        <nav
          aria-label={copy.navigation}
          className="header-navigation hidden items-center xl:flex"
        >
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className="nav-link"
          >
            <span className="nav-index" aria-hidden="true">
              00
            </span>
            <span>{t("home")}</span>
          </Link>
          <NavigationMenu
            className="site-mega-menu"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="header-products-trigger"
                  data-current={pathname.startsWith("/products") || undefined}
                >
                  <span className="nav-label-stack">
                    <span className="nav-index" aria-hidden="true">
                      01
                    </span>
                    <span>{t("products")}</span>
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="mega-menu-panel">
                    <p className="mega-menu-eyebrow">{copy.ranges}</p>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/products"
                        className="mega-menu-overview"
                        aria-current={
                          pathname === "/products" ? "page" : undefined
                        }
                      >
                        {t("allProducts")}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </NavigationMenuLink>
                    <div className="mega-menu-groups">
                      {groups.map((group, index) => (
                        <div key={group.href}>
                          <span className="mega-menu-index" aria-hidden="true">
                            0{index + 1}
                          </span>
                          <NavigationMenuLink asChild>
                            <Link
                              href={group.href}
                              className="mega-menu-group-title"
                              aria-current={
                                pathname === group.href ? "page" : undefined
                              }
                            >
                              {group.title}
                            </Link>
                          </NavigationMenuLink>
                          <ul className="mega-menu-links">
                            {group.children.map((item) => (
                              <li key={item.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={item.href}
                                    className="mega-menu-link"
                                    aria-current={
                                      pathname === item.href
                                        ? "page"
                                        : undefined
                                    }
                                  >
                                    {item.title}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <NavigationMenuLink asChild>
                      <Link href="/#tekbatt" className="mega-menu-tekbatt">
                        <span>{copy.tekbatt}</span>
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="nav-link"
            >
              <span className="nav-index" aria-hidden="true">
                0{index + 2}
              </span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="header-actions hidden items-center xl:flex">
          <ProductSearch groups={groups} />
          <LocaleSwitcher />
          <Button asChild size="sm" className="site-button header-contact">
            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
            >
              {copy.quote}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="header-actions flex items-center xl:hidden">
          <ProductSearch groups={groups} />
          <LocaleSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="header-menu-button"
                aria-label={t("menu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={locale === "ar" ? "left" : "right"}
              className="public-surface mobile-navigation"
              closeLabel={t("close")}
            >
              <SheetHeader className="mobile-navigation-heading">
                <SheetTitle>
                  SFGT<span aria-hidden="true"> /</span>
                </SheetTitle>
                <SheetDescription>
                  Sulemane Faruk General Trading LLC
                </SheetDescription>
              </SheetHeader>
              <nav
                className="mobile-navigation-links"
                aria-label={copy.navigation}
              >
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="mobile-navigation-link"
                  aria-current={pathname === "/" ? "page" : undefined}
                >
                  {t("home")}
                </Link>
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="mobile-navigation-link"
                  aria-current={pathname === "/products" ? "page" : undefined}
                >
                  {t("allProducts")}
                </Link>
                <Accordion type="single" collapsible>
                  {groups.map((group) => (
                    <AccordionItem key={group.href} value={group.href}>
                      <AccordionTrigger className="mobile-group-trigger">
                        {group.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <Link
                          href={group.href}
                          onClick={() => setOpen(false)}
                          className="mobile-group-overview"
                          aria-current={
                            pathname === group.href ? "page" : undefined
                          }
                        >
                          {group.title} {locale === "ar" ? "←" : "→"}
                        </Link>
                        {group.children.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="mobile-group-link"
                            aria-current={
                              pathname === item.href ? "page" : undefined
                            }
                          >
                            {item.title}
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Link
                  href="/#tekbatt"
                  onClick={() => setOpen(false)}
                  className="mobile-navigation-link"
                >
                  {copy.tekbatt}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="mobile-navigation-link"
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mobile-navigation-link mobile-contact-link"
                  aria-current={pathname === "/contact" ? "page" : undefined}
                >
                  {copy.quote}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </nav>
              <div className="mobile-navigation-preferences">
                <span>{copy.language}</span>
                <LocaleSwitcher />
              </div>
              <p className="mobile-navigation-location">{copy.location}</p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
