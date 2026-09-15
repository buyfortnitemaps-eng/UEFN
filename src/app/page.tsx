import { pageMetadata } from "./lib/catalog-seo.mjs";
import Hero from "./components/home/Hero";
import HomePage from "./ClientPage";
import GameTypes from "./pages/game-modes/GameTypes";
import FeaturedSection from "./pages/featured/FeaturedServer";
import JsonLd from "./components/JsonLd";
import { SITE_ORIGIN } from "./lib/runtime-config";

export const metadata = pageMetadata({
  title: "UEFN Map Templates, Verse Scripts & Custom Maps",
  description: "Explore UEFN map templates, Verse scripts and custom Fortnite map services. Compare projects and find assets for your next Fortnite Creative island.",
  path: "/",
});

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
