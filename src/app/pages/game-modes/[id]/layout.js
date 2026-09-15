import { apiUrl } from "../../../lib/runtime-config";
import { hasSameEntityId } from "../../../lib/entity-utils.mjs";

async function getGameMode(id) {
  try {
    const response = await fetch(apiUrl("game-types"), {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;

    const payload = await response.json();
    const gameTypes = Array.isArray(payload?.data) ? payload.data : [];
    return gameTypes.find((type) => hasSameEntityId(type, id)) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const gameMode = await getGameMode(id);
  const title = gameMode?.name
    ? `${gameMode.name} UEFN Assets`
    : "UEFN Game Mode Assets";
  const description = gameMode?.name
    ? `Browse Fortnite UEFN maps, templates, and assets for ${gameMode.name}.`
    : "Browse Fortnite UEFN maps, templates, and assets by game mode.";

  return {
    title,
    description,
    alternates: { canonical: `/pages/game-modes/${id}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/pages/game-modes/${id}`,
    },
  };
}

export default function GameModeLayout({ children }) {
  return children;
}
