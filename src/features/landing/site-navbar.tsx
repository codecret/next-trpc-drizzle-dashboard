"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Menu } from "lucide-react";
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

export function SiteNavbar({
  logo,
  groups,
}: {
  logo: string;
  groups: MenuGroup[];
}) {
  const t = useTranslations("Website.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 8);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeHiddenNavigation = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
      else setActiveMenu("");
    };
    desktop.addEventListener("change", closeHiddenNavigation);
    return () => desktop.removeEventListener("change", closeHiddenNavigation);
  }, []);
  const quoteLabel = isArabic ? "اطلب عرض سعر" : "Request a quote";
  const rangesLabel = isArabic ? "تصفّح فئات المنتجات" : "View product ranges";
  const quoteHref = pathname === "/" ? "/#quotation" : "/contact";
  const links = [
    { label: isArabic ? "خدماتنا" : "Our services", href: "/services" },
    { label: isArabic ? "من نحن" : "About", href: "/about" },
    { label: isArabic ? "الموارد" : "Resources", href: "/support" },
    { label: t("contact"), href: "/contact" },
  ];
  const productRoutes = [
    {
      brand: "Toshiba",
      title:
        groups.find((group) => group.href === "/products/batteries")?.title ??
        (isArabic
          ? "البطاريات والطاقة المحمولة"
          : "Batteries & portable power"),
      href: "/products/batteries",
    },
    {
      brand: "Toshiba",
      title:
        groups.find((group) => group.href === "/products/led-lighting")
          ?.title ?? (isArabic ? "إضاءة LED" : "LED lighting"),
      href: "/products/led-lighting",
    },
    {
      brand: "Tekbatt",
      title: isArabic ? "مجموعات البطاريات" : "Battery ranges",
      href: "/#tekbatt",
    },
    {
      brand: isArabic ? "التجارة العامة" : "General trading",
      title:
        groups.find((group) => group.href === "/products/commodities")?.title ??
        (isArabic ? "السلع والمستلزمات" : "Commodities & supplies"),
      href: "/products/commodities",
    },
  ];
  const industriesLabel = isArabic ? "القطاعات" : "Industries";
  const industryRoutes = [
    {
      title: isArabic ? "التجزئة والجملة" : "Retail & wholesale",
      detail: isArabic
        ? "البطاريات والطاقة المحمولة"
        : "Batteries & portable power",
      href: "/products/batteries",
    },
    {
      title: isArabic ? "الإضاءة والمشاريع" : "Lighting & projects",
      detail: isArabic
        ? "مصابيح وأنابيب وإضاءة LED"
        : "LED lamps, tubes & fixtures",
      href: "/products/led-lighting",
    },
    {
      title: isArabic ? "الأغذية والمشروبات" : "Food & beverage",
      detail: isArabic
        ? "السلع الغذائية والمستلزمات"
        : "Food commodities & supplies",
      href: "/products/commodities",
    },
    {
      title: isArabic ? "الصناعة والتصنيع" : "Industry & manufacturing",
      detail: isArabic ? "المواد الكيميائية" : "Chemical supplies",
      href: "/products/chemicals",
    },
    {
      title: isArabic ? "البناء والتشييد" : "Construction",
      detail: isArabic ? "مواد البناء" : "Construction materials",
      href: "/products/construction-materials",
    },
    {
      title: isArabic ? "الضيافة" : "Hospitality",
      detail: isArabic ? "مستلزمات الضيافة" : "Hospitality supplies",
      href: "/products/hospitality",
    },
  ];
  const closeMenus = () => {
    setOpen(false);
    setActiveMenu("");
  };

  return (
    <header
      className="site-header public-surface"
      data-scrolled={scrolled || undefined}
    >
      <a href="#main-content" className="site-skip-link">
        {t("skip")}
      </a>
      <div className="site-header-inner">
        <Link
          href="/"
          aria-label={
            isArabic
              ? "سليمان فاروق للتجارة العامة — الرئيسية"
              : "Sulemane Faruk General Trading LLC — Home"
          }
          onClick={closeMenus}
          className="brand-logo"
        >
          <Image
            src={logo}
            width={190}
            height={56}
            alt="Sulemane Faruk General Trading LLC"
            priority
            className="brand-logo-image"
            sizes="(max-width: 767px) 152px, (max-width: 1199px) 164px, 180px"
          />
        </Link>

        <nav
          aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"}
          className="header-navigation"
        >
          <NavigationMenu
            className="site-mega-menu"
            dir={isArabic ? "rtl" : "ltr"}
            value={activeMenu}
            onValueChange={setActiveMenu}
            delayDuration={140}
            skipDelayDuration={240}
            aria-label={
              isArabic ? "المنتجات والقطاعات" : "Products and industries"
            }
          >
            <NavigationMenuList>
              <NavigationMenuItem value="products">
                <NavigationMenuTrigger
                  className="header-products-trigger"
                  data-current={pathname.startsWith("/products") || undefined}
                >
                  {t("products")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="mega-menu-panel">
                    <div className="mega-menu-routes">
                      {productRoutes.map((route) => (
                        <NavigationMenuLink asChild key={route.href}>
                          <Link
                            href={route.href}
                            className="mega-menu-route"
                            aria-current={
                              pathname === route.href ? "page" : undefined
                            }
                            onClick={closeMenus}
                          >
                            <span className="mega-menu-route-brand">
                              {route.brand}
                            </span>
                            <span className="mega-menu-route-title">
                              {route.title}
                            </span>
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/products"
                        className="mega-menu-overview"
                        onClick={closeMenus}
                      >
                        {rangesLabel}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="industries">
                <NavigationMenuTrigger className="header-products-trigger">
                  {industriesLabel}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="mega-menu-panel industry-menu-panel">
                    <div className="mega-menu-routes">
                      {industryRoutes.map((route) => (
                        <NavigationMenuLink asChild key={route.href}>
                          <Link
                            href={route.href}
                            className="mega-menu-route"
                            aria-current={
                              pathname === route.href ? "page" : undefined
                            }
                            onClick={closeMenus}
                          >
                            <span className="mega-menu-route-title">
                              {route.title}
                            </span>
                            <span className="mega-menu-route-brand">
                              {route.detail}
                            </span>
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="nav-link"
              onClick={closeMenus}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions header-desktop-actions">
          <ProductSearch groups={groups} />
          <LocaleSwitcher />
          <Link
            href={quoteHref}
            className="header-quote-link"
            onClick={closeMenus}
          >
            {quoteLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="header-actions header-mobile-actions">
          <ProductSearch groups={groups} />
          <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
              setOpen(nextOpen);
              if (nextOpen) setActiveMenu("");
            }}
          >
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="header-menu-button"
                aria-label={t("menu")}
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isArabic ? "left" : "right"}
              className="public-surface mobile-navigation"
              closeLabel={t("close")}
              dir={isArabic ? "rtl" : "ltr"}
              data-mobile-navigation
            >
              <SheetHeader className="mobile-navigation-heading">
                <SheetTitle>{t("menu")}</SheetTitle>
                <SheetDescription>
                  {isArabic
                    ? "سليمان فاروق للتجارة العامة ذ.م.م"
                    : "Sulemane Faruk General Trading LLC"}
                </SheetDescription>
              </SheetHeader>
              <nav
                className="mobile-navigation-links"
                aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"}
              >
                <Link
                  href="/"
                  onClick={closeMenus}
                  className="mobile-navigation-link"
                  aria-current={pathname === "/" ? "page" : undefined}
                >
                  {t("home")}
                </Link>
                <Accordion type="single" collapsible>
                  <AccordionItem value="products">
                    <AccordionTrigger className="mobile-group-trigger">
                      {t("products")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {productRoutes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={closeMenus}
                          className="mobile-product-route"
                          aria-current={
                            pathname === route.href ? "page" : undefined
                          }
                        >
                          <span>{route.brand}</span>
                          {route.title}
                        </Link>
                      ))}
                      <Link
                        href="/products"
                        onClick={closeMenus}
                        className="mobile-group-overview"
                      >
                        {rangesLabel}{" "}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="industries">
                    <AccordionTrigger className="mobile-group-trigger">
                      {industriesLabel}
                    </AccordionTrigger>
                    <AccordionContent>
                      {industryRoutes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={closeMenus}
                          className="mobile-product-route"
                          aria-current={
                            pathname === route.href ? "page" : undefined
                          }
                        >
                          {route.title}
                          <span>{route.detail}</span>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className="mobile-navigation-link"
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mobile-navigation-footer">
                <Link
                  href={quoteHref}
                  onClick={closeMenus}
                  className="header-quote-link mobile-quote-link"
                >
                  {quoteLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <div className="mobile-navigation-preferences">
                  <span>{t("language")}</span>
                  <LocaleSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Existing public layouts share the same header as the supplier homepage.
export { SiteNavbar as Navbar };
