import PortfolioClient from "./PortfolioClient";
import { catalogRequest } from "../lib/catalog-data";
export default async function PortfolioPage() {
  const { data } = await catalogRequest("portfolios");
  const projects = data.map(({ _id, title, type, description, image, youtubeId, tags, stats }) => ({ _id, title, type, description, image, youtubeId, tags, stats }));
  return <PortfolioClient projects={projects} />;
}
