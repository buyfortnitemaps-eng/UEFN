import type { Metadata } from "next";
import "./globals.css";
import SiteProviders from "./site-providers";
import { SITE_ORIGIN } from "./lib/runtime-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "UEFNMAP | Premium Fortnite UEFN Assets", template: "%s | UEFNMAP" },
  description: "Premium Fortnite UEFN map templates, Verse scripts, and Creative 2.0 assets.",
  applicationName: "UEFNMAP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><SiteProviders>{children}</SiteProviders></body></html>;
}
