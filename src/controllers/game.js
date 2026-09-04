import { getGameById, getGames } from "../services/game.js";

export const findGames = async (req, res) => {
  try {
    const games = await getGames();

    res.status(200).json(games);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

export const findGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await getGameById(id);

    return res.status(200).json(game);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};
