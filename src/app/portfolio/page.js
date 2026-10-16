import CatalogNotice from "../components/CatalogNotice";
import PortfolioClient from "./PortfolioClient";
import { catalogRequest } from "../lib/catalog-data";
export default async function PortfolioPage() {
  const { data, catalog } = await catalogRequest("portfolios");
  const projects = data.map(({ _id, title, type, description, image, youtubeId, tags, stats }) => ({ _id, title, type, description, image, youtubeId, tags, stats }));
  return <><CatalogNotice catalog={catalog} className="relative z-10 mt-24 mx-6" /><PortfolioClient projects={projects} /></>;
}
