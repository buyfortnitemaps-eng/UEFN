import GameTypesClient from "./GameTypesClient";
import { getGameTypes } from "../../lib/catalog-data";
export default async function GameTypes({ standalone = false }) {
  return <GameTypesClient gameTypes={[...await getGameTypes()].reverse()} standalone={standalone} />;
}
