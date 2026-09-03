import {
  addGameToLibrary,
  getLibrary,
  updateLibraryGame,
  deleteGameFromLibrary,
} from "../services/library.js";

export async function addGame(req, res) {
  try {
    const { id } = req.body;
    const userId = req.user.userId;

    if (!id) {
      return res.status(400).json({
        message: "O ID do jogo é obrigatório.",
      });
    }

    const gameId = Number(id);

    if (Number.isNaN(gameId)) {
      return res.status(400).json({
        message: "O ID do jogo deve ser um número.",
      });
    }

    const library = await addGameToLibrary(userId, gameId);

    return res.status(201).json(library);
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao adicionar jogo à biblioteca",
    });
  }
}

export async function getGame(req, res) {
  try {
    const userId = req.user.userId;

    const library = await getLibrary(userId);

    return res.status(200).json(library);
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao buscar biblioteca",
    });
  }
}

export async function updateGame(req, res) {
  try {
    const { gameId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const game = await updateLibraryGame(userId, gameId, status);

    return res.status(200).json({
      message: "Atualizado com sucesso",
      game,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao atualizar",
    });
  }
}

export async function deleteGame(req, res) {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;

    const library = await deleteGameFromLibrary(userId, gameId);

    return res.status(200).json({
      message: "Jogo removido da biblioteca",
      library,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao remover jogo",
    });
  }
}
