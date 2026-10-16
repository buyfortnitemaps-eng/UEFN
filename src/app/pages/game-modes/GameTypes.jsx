import CatalogNotice from "../../components/CatalogNotice";
import GameTypesClient from "./GameTypesClient";
import { getGameTypes } from "../../lib/catalog-data";
export default async function GameTypes({ standalone = false }) {
  const modes = await getGameTypes();
  return <>{standalone && <CatalogNotice catalog={modes[0]?.catalog} className="relative z-10 mt-24 mx-6" />}<GameTypesClient gameTypes={[...modes].reverse()} standalone={standalone} /></>;
}
