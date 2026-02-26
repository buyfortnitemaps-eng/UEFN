import GameTypesClient from "./page";

async function getGameTypes() {
  const res = await fetch(
    "https://uefn-maps-server.vercel.app/api/v1/game-types",
    {
      next: { revalidate: 60 }, // ISR (1 minute cache)
    }
  );

  const data = await res.json();
  return (data.data || []).reverse();
}

export default async function GameTypes() {
  const gameTypes = await getGameTypes();

  return <GameTypesClient gameTypes={gameTypes} />;
}