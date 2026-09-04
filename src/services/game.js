import "dotenv/config.js";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

function mapGame(game) {
  return {
    id: game.id,
    name: game.name,
    description: game.description_raw ?? null,
    released: game.released ?? null,
    rating: game.rating ?? null,
    metacritic: game.metacritic ?? null,
    cover: game.background_image ?? null,
    genres: game.genres?.map((genre) => genre.name) ?? [],
    platforms: game.platforms?.map((platform) => platform.platform.name) ?? [],
    developers: game.developers?.map((developer) => developer.name) ?? [],
  };
}

export async function getGames() {
  if (!RAWG_API_KEY) {
    throw new Error("RAWG_API_KEY não configurada");
  }

  const response = await fetch(
    `https://api.rawg.io/api/games?key=${RAWG_API_KEY}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao buscar jogos na RAWG API");
  }

  if (!Array.isArray(data.results)) {
    throw new Error("Resposta inválida da RAWG API");
  }

  return data.results.map(mapGame);
}

export async function getGameById(id) {
  if (!RAWG_API_KEY) {
    throw new Error("RAWG_API_KEY não configurada");
  }

  const response = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao buscar jogo na RAWG API");
  }

  return mapGame(data);
}
