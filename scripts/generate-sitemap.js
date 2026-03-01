/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const axios = require('axios');

async function generateSitemap() {
  const baseUrl = "https://uefnmap.com";
  // আপনার সঠিক API URL (প্রোডাক্ট সংখ্যা বেশি হলে limit আরও বাড়িয়ে দিতে পারেন)
  const apiUrl = "https://uefn-maps-server.vercel.app/api/v1/products/client?limit=100&category=All&sort=newest";
  
  try {
    console.log(`Fetching products from: ${apiUrl}...`);
    const response = await axios.get(apiUrl);
    
    // আপনার Fetch লজিক অনুযায়ী: productsData.data সরাসরি অ্যারে দিচ্ছে
    const products = response.data?.data || [];

    if (!Array.isArray(products) || products.length === 0) {
      console.log("⚠️ No products found. Please check if your database has items.");
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/featured</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`;

    products.forEach(product => {
      xml += `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${product.updatedAt || new Date().toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`;
    });

    xml += `\n</urlset>`;

    // public ফোল্ডারে ফাইলটি সেভ করা
    fs.writeFileSync('public/sitemap.xml', xml);
    console.log(`✅ Success! ${products.length} products added to public/sitemap.xml`);
  } catch (error) {
    console.error('❌ Error:', error.response ? `Status ${error.response.status}` : error.message);
  }
}

generateSitemap();