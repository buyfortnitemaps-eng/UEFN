// // src/app/page.js (Server Component)
// import ClientPage from "./ClientPage"; // আপনার আসল ক্লায়েন্ট পেজটি ইম্পোর্ট করুন

// export const metadata = {
//   title: "UEFNMAP | Buy Premium Fortnite Maps & Verse Program",
//   description: "Buy custom Fortnite maps, UEFN map store, and premium Fortnite Creative 2.0 islands. Explore Deathrun, Zone wars, and more.",
//   keywords: "Fortnite UEFN maps, Fortnite Creative, UEFN map store, Custom Fortnite maps, Buy Fortnite maps, UEFN creator Shope",
//   openGraph: {
//     title: "MAGRIL UEFN | Pro Fortnite Map Store",
//     description: "Explore trending Fortnite maps and UEFN assets.",
//     images: ["/og-image.jpg"],
//   },
// };

// export default function Page() {
//   return <ClientPage />;
// }


import Hero from "./components/home/Hero"
import HomePage from "./ClientPage"
import GameTypes from "./pages/game-modes/GameTypes"
import FeaturedSection from "./pages/featured/page"

export const metadata = {
  title: "UEFNMAP | Buy Premium Fortnite Maps & Verse Program",
  description:
    "Buy custom Fortnite maps, UEFN map store, and premium Fortnite Creative 2.0 islands.",
};

export default function Page() {
  return (
    <>
      {/* SEO content server side */}
      <section className="sr-only">
        <h1>Premium Fortnite UEFN Maps and Creative 2.0 Store</h1>
        <h2>Custom Fortnite Map Creator and UEFN Shop</h2>
        <p>
          Explore the best UEFN creator shop for high-end UEFN templates, Verse
          scripts, and custom Fortnite map design services.
        </p>
      </section>

      <Hero />
      <GameTypes />
      <FeaturedSection />
      <HomePage />
    </>
  );
}