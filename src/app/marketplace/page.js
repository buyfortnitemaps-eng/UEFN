import ShopeClient from "./ShopeClient";

// ISR ডেটা ফেচিং
async function getInitialData() {
  const [productsRes, categoriesRes] = await Promise.all([
    fetch("https://uefn-maps-server.vercel.app/api/v1/products/client?page=1&limit=12&category=All&search=&sort=newest", {
      next: { revalidate: 60 },
    }),
    fetch("https://uefn-maps-server.vercel.app/api/v1/categories", {
      next: { revalidate: 60 }, // ক্যাটাগরি সাধারণত কম পরিবর্তন হয়
    })
  ]);

  const productsData = await productsRes.json();
  const categoriesData = await categoriesRes.json();

  return {
    initialProducts: productsData.data || [],
    initialHasMore: productsData.meta?.hasMore || false,
    initialCategories: categoriesData.success ? categoriesData.data : [],
  };
}

export default async function Page() {
  const data = await getInitialData();

  return (
    <ShopeClient 
      initialProducts={data.initialProducts}
      initialHasMore={data.initialHasMore}
      initialCategories={data.initialCategories}
    />
  );
}