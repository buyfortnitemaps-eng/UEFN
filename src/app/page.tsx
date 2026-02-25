// src/app/page.js (Server Component)
import ClientPage from "./ClientPage"; // আপনার আসল ক্লায়েন্ট পেজটি ইম্পোর্ট করুন

export const metadata = {
  title: "UEFNMAP | Buy Premium Fortnite Maps & Verse Program",
  description: "Buy custom Fortnite maps, UEFN map store, and premium Fortnite Creative 2.0 islands. Explore Deathrun, Zone wars, and more.",
  keywords: "Fortnite UEFN maps, Fortnite Creative, UEFN map store, Custom Fortnite maps, Buy Fortnite maps, UEFN creator Shope",
  openGraph: {
    title: "MAGRIL UEFN | Pro Fortnite Map Store",
    description: "Explore trending Fortnite maps and UEFN assets.",
    images: ["/og-image.jpg"],
  },
};

export default function Page() {
  return <ClientPage />;
}