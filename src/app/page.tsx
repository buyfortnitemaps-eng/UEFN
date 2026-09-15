import type { Metadata } from "next";
import Hero from "./components/home/Hero";
import HomePage from "./ClientPage";
import GameTypes from "./pages/game-modes/GameTypes";
import FeaturedSection from "./pages/featured/page";
import JsonLd from "./components/JsonLd";
import { SITE_ORIGIN } from "./lib/runtime-config";

export const metadata: Metadata = {
  title: { absolute: "UEFN Map Templates, Verse Scripts & Custom Maps | UEFNMAP" },
  description:
    "Explore UEFN map templates, Verse scripts and custom Fortnite map services. Compare projects and find assets for your next Fortnite Creative island.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "UEFN Map Templates, Verse Scripts & Custom Maps | UEFNMAP",
    description:
      "Premium UEFN templates, Verse scripts, and custom Fortnite map services.",
    type: "website",
    url: "/",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", "@id": `${SITE_ORIGIN}/#organization`, name: "UEFNMAP", url: SITE_ORIGIN },
          { "@type": "WebSite", "@id": `${SITE_ORIGIN}/#website`, name: "UEFNMAP", url: SITE_ORIGIN,
            publisher: { "@id": `${SITE_ORIGIN}/#organization` }, inLanguage: "en" },
        ],
      }} />
      <Hero />
      <GameTypes />
      <FeaturedSection />
      <HomePage />
    </>
  );
}
