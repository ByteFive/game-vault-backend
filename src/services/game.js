const RAWG_API_KEY = process.env.RAWG_API_KEY;

export async function getGames() {
  const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}`);

  const data = await response.json();

  return data.results.map((game) => ({
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
  }));
}

export async function getGameById(id) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`,
  );

  const game = await response.json();

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
