import { getAllByGameId, getAllByUser } from "../services/rating.js";

export async function getByUser(req, res) {
  try {
    let userId = req.user.id;
    const reviews = await getAllByUser(userId);

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function getByGameId(req, res) {
  try {
    let gameId = req.params.gameId;
    const reviews = await getAllByGameId(gameId);

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await deleteRating(id, userId);

    if (!review) {
      return res.status(404).json({
        message: "Avaliação não encontrada",
      });
    }

    res.status(200).json({
      message: "Avaliação deletada com sucesso",
      review,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function createReview(req, res) {
  try {
    const userId = req.user.id;
    const { gameId, score, comment } = req.body;

    const review = await createRating({ userId, gameId, score, comment });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { score, comment } = req.body;

    const review = await updateRating(id, userId, { score, comment });

    if (!review) {
      return res.status(404).json({
        message: "Avaliação não encontrada",
      });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}


