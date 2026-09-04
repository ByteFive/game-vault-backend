import Top5 from "../models/top5.js";

export async function getTop5ByUserId(userId) {
  return await Top5.find({ userId }).sort({ position: 1 });
}

export async function getTop5ByPosition(userId, position) {
  return await Top5.findOne({ userId, position });
}

export async function createTop5(data) {
  return await Top5.create(data);
}

// A alteração de posição não é permitida, pois a posição de destino já pode estar ocupada, violando as regras de unicidade do Top 5.
export async function updateTop5(userId, currentPosition, newPosition) {
  if (currentPosition === newPosition) {
    return await Top5.findOne({
      userId,
      position: currentPosition,
    });
  }

  const currentGame = await Top5.findOne({
    userId,
    position: currentPosition,
  });

  if (!currentGame) {
    return null;
  }

  const targetGame = await Top5.findOne({
    userId,
    position: newPosition,
  });

  if (!targetGame) {
    currentGame.position = newPosition;

    await currentGame.save();

    return currentGame;
  }

  const currentGameId = currentGame.gameId;
  const targetGameId = targetGame.gameId;

  currentGame.gameId = targetGameId;
  targetGame.gameId = currentGameId;

  await currentGame.save();
  await targetGame.save();

  return await Top5.find({
    userId,
    position: {
      $in: [currentPosition, newPosition],
    },
  }).sort({ position: 1 });
}

export async function deleteTop5(userId, position) {
  return await Top5.deleteOne({
    userId,
    position,
  });
}
