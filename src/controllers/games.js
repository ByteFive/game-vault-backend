

const API_KEY = "ff8d791912fc4da7945ec7396c0403fe";

const URL = `https://rawg.io/api/games?key=${API_KEY}`



export const findGames = async (req ,res) => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao buscar jogos!" });
  }
};

export const findGameById = async(req , res) => {
    try{
        const { id } = req.params; 
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`,);
        const rawGame = await response.json();

        const game = {
          id: rawGame.id,
          name: rawGame.name,
          description: rawGame.description_raw, // Texto limpo sem tags HTML
          released: rawGame.released,
          rating: rawGame.rating,
          metacritic: rawGame.metacritic,
          cover: rawGame.background_image,
          genres: rawGame.genres?.map((g) => g.name) || [],
          platforms: rawGame.platforms?.map((p) => p.platform.name) || [],
          developers: rawGame.developers?.map((d) => d.name) || [],
        };
        return res.json(game);

    }
    catch(error){
    return res.status(500).json({ error: 'Erro ao buscar detalhes do jogo.' });
  
    }
}




