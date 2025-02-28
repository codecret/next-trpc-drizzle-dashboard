"use client";
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JSX } from "react";
import Image from "next/image";
import { ToggleTheme } from "@/components/toogle-theme";
import { Separator } from "@radix-ui/react-separator";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

// interface NavbarProps {
//   logo?: {
//     url: string;
//     src: string;
//     alt: string;
//     title: string;
//   };
//   menu?: MenuItem[];
//   mobileExtraLinks?: {
//     name: string;
//     url: string;
//   }[];
//   auth?: {
//     login: {
//       text: string;
//       url: string;
//     };
//     // signup: {
//     //   text: string;
//     //   url: string;
//     // };
//   };
// }

const Navbar = () => {
  const t = useTranslations("HomePage");

  const logo = {
    url: "/",
    src: "/freelogo.png",
    alt: t("nav.logoAlt"),
    title: t("nav.title"),
  };
  const menu = [
    { title: t("nav.home"), url: "#" },
    {
      title: t("nav.products"),
      url: "#",
      items: [
        {
          title: t("nav.blog"),
          description: t("nav.blogDescription"),
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: t("nav.company"),
          description: t("nav.companyDescription"),
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: t("nav.careers"),
          description: t("nav.careersDescription"),
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: t("nav.support"),
          description: t("nav.supportDescription"),
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: t("nav.resources"),
      url: "#",
      items: [
        {
          title: t("nav.helpCenter"),
          description: t("nav.helpCenterDescription"),
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: t("nav.contactUs"),
          description: t("nav.contactUsDescription"),
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: t("nav.status"),
          description: t("nav.statusDescription"),
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: t("nav.termsOfService"),
          description: t("nav.termsDescription"),
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: t("nav.pricing"),
      url: "#",
    },
    {
      title: t("nav.blog"),
      url: "#",
    },
  ];
  const mobileExtraLinks = [
    { name: t("nav.press"), url: "#" },
    { name: t("nav.contact"), url: "#" },
    { name: t("nav.imprint"), url: "#" },
    { name: t("nav.sitemap"), url: "#" },
  ];
  const auth = {
    login: {
      text: t("nav.login"),
      url: "/auth/sign-innn",
    },
  };
  return (
    <section className="py-4">
      <div className="container m-auto">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="w-8"
                alt={logo.alt}
                width={32}
                height={32}
              />
            </a>
            <h1>{t("title")}</h1>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <LocaleSwitcher />
            <SheetFooter className="flex-col sm:flex-col justify-start">
              <ToggleTheme />
            </SheetFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/sign-in">{auth.login.text}</Link>
            </Button>
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="w-8"
                alt={logo.alt}
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold">{logo.title}</span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <Image
                        src={logo.src}
                        className="w-8"
                        alt={t("nav.logoAlt")}
                        width={32}
                        height={32}
                      />
                      <span className="text-lg font-semibold">
                        {t("nav.title")}
                      </span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <a
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                    <Separator className="mb-2" />
                    <ToggleTheme />
                  </SheetFooter>
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <Link href={auth.login.url}>{auth.login.text}</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar };
