import {
  createTop5,
  deleteTop5,
  getTop5ByUserId,
  updateTop5,
} from "../services/top5.js";

export async function get(req, res) {
  try {
    const userId = req.user.userId;

    const top5 = await getTop5ByUserId(userId);

    return res.status(200).json(top5);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function create(req, res) {
  try {
    const userId = req.user.userId;
    const { gameId, position } = req.body;

    const top5 = await createTop5({
      userId,
      gameId,
      position,
    });

    return res.status(201).json(top5);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

// A alteração de posição não é permitida, pois a posição de destino já pode estar ocupada, violando as regras de unicidade do Top 5.
export async function update(req, res) {
  try {
    const userId = req.user.userId;
    const currentPosition = Number(req.params.position);
    const { position: newPosition } = req.body;

    if (
      !Number.isInteger(currentPosition) ||
      currentPosition < 1 ||
      currentPosition > 5
    ) {
      return res.status(400).json({
        message: "Posição atual inválida",
      });
    }

    if (!Number.isInteger(newPosition) || newPosition < 1 || newPosition > 5) {
      return res.status(400).json({
        message: "Nova posição inválida",
      });
    }

    const result = await updateTop5(userId, currentPosition, newPosition);

    if (!result) {
      return res.status(404).json({
        message: "Jogo não encontrado nessa posição",
      });
    }

    return res.status(200).json({
      message: "Posição alterada com sucesso",
      top5: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function remove(req, res) {
  try {
    const userId = req.user.userId;
    const position = Number(req.params.position);

    const result = await deleteTop5(userId, position);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Jogo não encontrado nessa posição",
      });
    }

    return res.status(200).json({
      message: "Jogo removido do Top 5 com sucesso",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}
