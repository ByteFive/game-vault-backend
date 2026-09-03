import Library from "../models/library.js";

export async function addGameToLibrary(userId, gameId) {
  let library = await Library.findOne({ userId });

  if (!library) {
    return await Library.create({
      userId,
      games: [
        {
          gameId,
          status: "want_to_play",
        },
      ],
    });
  }

  const alreadyExists = library.games.some(
    (game) => game.gameId === gameId,
  );

  if (alreadyExists) {
    const error = new Error("Esse jogo já está na sua biblioteca");
    error.statusCode = 409;
    throw error;
  }

  library.games.push({
    gameId,
    status: "want_to_play",
  });

  await library.save();

  return library;
}

export async function getLibrary(userId) {
  const library = await Library.findOne({ userId });

  if (!library) {
    const error = new Error("Biblioteca não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return library;
}

export async function updateLibraryGame(userId, gameId, status) {
  const validStatuses = [
    "want_to_play",
    "playing",
    "completed",
    "abandoned",
  ];

  if (!validStatuses.includes(status)) {
    const error = new Error("Status inválido");
    error.statusCode = 400;
    throw error;
  }

  const library = await Library.findOne({ userId });

  if (!library) {
    const error = new Error("Biblioteca não encontrada");
    error.statusCode = 404;
    throw error;
  }

  const game = library.games.find(
    (game) => game.gameId === Number(gameId),
  );

  if (!game) {
    const error = new Error("Jogo não encontrado na biblioteca");
    error.statusCode = 404;
    throw error;
  }

  game.status = status;

  await library.save();

  return game;
}

export async function deleteGameFromLibrary(userId, gameId) {
  const library = await Library.findOne({ userId });

  if (!library) {
    const error = new Error("Biblioteca não encontrada");
    error.statusCode = 404;
    throw error;
  }

  const gameIndex = library.games.findIndex(
    (game) => game.gameId === Number(gameId),
  );

  if (gameIndex === -1) {
    const error = new Error("Jogo não encontrado na biblioteca");
    error.statusCode = 404;
    throw error;
  }

  library.games.splice(gameIndex, 1);

  await library.save();

  return library;
}