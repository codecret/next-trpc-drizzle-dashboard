import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import "./rtl.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import TRPCProvider from "@/lib/trpc/Provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/routing";
import { brand, company } from "@/features/catalogue/catalogue";
import { siteOrigin } from "@/features/catalogue/metadata";

const publicFont = Manrope({
  variable: "--font-public",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: company.name, template: "%s | SFGT" },
  description:
    "Toshiba batteries, LED lighting and general trading from Dubai.",
  icons: { icon: brand.logo, apple: brand.logo },
};

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="light"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${publicFont.variable} antialiased`}
      >
        <TRPCProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </TRPCProvider>
        <Toaster />
      </body>
    </html>
  );
}
