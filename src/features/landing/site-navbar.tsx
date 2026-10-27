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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { label: t("about"), href: "/about" },
    { label: t("services"), href: "/services" },
    { label: t("support"), href: "/support" },
  ];
  const logoLink = (
    <Link
      href="/"
      aria-label="Sulemane Faruk General Trading LLC — Home"
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
        sizes="(max-width: 639px) 148px, 174px"
      />
    </Link>
  );
  return (
    <header className="site-header sticky top-0 z-40">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        {t("skip")}
      </a>
      <div className="site-container site-header-inner">
        {logoLink}
        <nav
          aria-label={t("menu")}
          className="header-navigation hidden items-center xl:flex"
        >
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className="nav-link"
          >
            {t("home")}
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
                  {t("products")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="mega-menu-panel">
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
                      {groups.map((group) => (
                        <div key={group.href}>
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
            >
              {link.label}
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
              {t("contact")}
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="header-actions flex items-center xl:hidden">
          <ProductSearch groups={groups} />
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
                <SheetTitle>SFGT</SheetTitle>
                <SheetDescription>
                  Sulemane Faruk General Trading LLC
                </SheetDescription>
              </SheetHeader>
              <nav className="mobile-navigation-links" aria-label={t("menu")}>
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
                  {t("contact")}
                </Link>
              </nav>
              <div className="mobile-navigation-preferences">
                <LocaleSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
