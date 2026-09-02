import {
  getTop5ByUserId,
  createTop5,
  updateTop5,
  deleteTop5,
} from "../services/top5";

export async function get(req, res) {
  try {
    const user = req.user;

    const top5 = await getTop5ByUserId(user.id);

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
    const user = req.user;

    const { position, gameId } = req.body;

    const top5 = await createTop5({
      userId: user.id,
      position,
      gameId,
    });

    return res.status(201).json(top5);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function update(req, res) {
  try {
    const user = req.user;

    const { position } = req.params;

    const top5 = await updateTop5(
      user.id,
      position,
      req.body
    );

    if (!top5) {
      return res.status(404).json({
        message: "Position not found",
      });
    }

    return res.status(200).json(top5);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function remove(req, res) {
  try {
    const user = req.user;

    const { position } = req.params;

    const result = await deleteTop5(user.id, position);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Position not found",
      });
    }

    return res.status(200).json({
      message: "Position deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}
export async function remove(req, res) {
  const user = req.user;
  
  const { position } = req.params;

  try {
    await deleteTop5(user.id, position);

    res.status(200).send({ message: "Position deleted sucessfully" });
  } catch (error) {
    console.error(error);
  }
}
