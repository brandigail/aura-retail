import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeInitScript } from "@/features/theme/theme-store";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { storeName, tagline } = await getSettings();
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title: { default: storeName, template: `%s | ${storeName}` },
    description: tagline,
    openGraph: { siteName: storeName, type: "website" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-foreground"
        >
          Skip to main content
        </a>
        <Providers zarRate={settings.zarPerUsdHundredths / 100}>
          <AnnouncementBar text={settings.announcement} />
          <SiteHeader storeName={settings.storeName} />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
