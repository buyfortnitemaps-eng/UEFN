import ShopeClient from "./ShopeClient";

export const metadata = {
  title: "Shop UEFN Map Templates & Fortnite Assets",
  description: "Browse Fortnite UEFN map templates, Verse scripts, and creative assets.",
  alternates: { canonical: "/marketplace" },
};

async function getInitialData() {
  const url = "https://uefn-maps-server.vercel.app/api/v1/products/client?page=1&limit=12&category=All&search=&sort=newest";
  
  const [productsRes, categoriesRes] = await Promise.all([
    fetch(url, { next: { revalidate: 60 } }),
    fetch("https://uefn-maps-server.vercel.app/api/v1/categories", { next: { revalidate: 60 } })
  ]);

  const productsData = await productsRes.json();
  const categoriesData = await categoriesRes.json();

  return {
    initialProducts: productsData.data || [],
    initialTotal: productsData.meta?.total || 0, // মোট প্রোডাক্ট সংখ্যা
    initialCategories: categoriesData.success ? categoriesData.data : [],
  };
}

export default async function Page() {
  const data = await getInitialData();
  return (
    <ShopeClient 
      initialProducts={data.initialProducts}
      initialTotal={data.initialTotal}
      initialCategories={data.initialCategories}
    />
  );
}