import User from "../models/user.js";
import Library from "../models/library.js";
import Rating from "../models/rating.js";
import Top5 from "../models/top5.js";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

const RAWG_BASE_URL = "https://api.rawg.io/api";

function normalizeGame(rawGame) {
  if (!rawGame) {
    return null;
  }

  return {
    id: rawGame.id,
    name: rawGame.name,
    description:
      rawGame.description_raw ??
      rawGame.description ??
      null,
    released: rawGame.released ?? null,
    rating: rawGame.rating ?? null,
    metacritic: rawGame.metacritic ?? null,
    cover: rawGame.background_image ?? null,

    genres:
      rawGame.genres?.map(
        (genre) => genre.name,
      ) ?? [],

    platforms:
      rawGame.platforms?.map(
        (platform) => platform.platform.name,
      ) ?? [],

    developers:
      rawGame.developers?.map(
        (developer) => developer.name,
      ) ?? [],
  };
}

async function fetchRawg(endpoint) {
  if (!RAWG_API_KEY) {
    throw new Error(
      "RAWG_API_KEY não configurada no ambiente",
    );
  }

  const separator = endpoint.includes("?")
    ? "&"
    : "?";

  const response = await fetch(
    `${RAWG_BASE_URL}${endpoint}${separator}key=${RAWG_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(
      `RAWG retornou status ${response.status}`,
    );
  }

  return response.json();
}

async function getGames() {
  const data = await fetchRawg("/games");

  return data.results.map(normalizeGame);
}

async function getGameById(id) {
  const data = await fetchRawg(`/games/${id}`);

  return normalizeGame(data);
}

function requireAuthenticatedUser(context) {
  if (!context.user?.userId) {
    throw new Error("Autenticação necessária");
  }

  return context.user.userId;
}

async function populateLibrary(library) {
  if (!library) {
    return null;
  }

  const result = library.toObject
    ? library.toObject()
    : library;

  result.id = result._id?.toString() ?? result.id;

  result.games = await Promise.all(
    result.games.map(async (libraryGame) => ({
      gameId: libraryGame.gameId,
      status: libraryGame.status,
      game: await getGameById(
        libraryGame.gameId,
      ),
    })),
  );

  return result;
}

async function populateRating(rating) {
  if (!rating) {
    return null;
  }

  const result = rating.toObject
    ? rating.toObject()
    : rating;

  result.id = result._id?.toString() ?? result.id;

  result.game = await getGameById(
    result.gameId,
  );

  return result;
}

async function populateTop5(top5) {
  if (!top5) {
    return null;
  }

  const result = top5.toObject
    ? top5.toObject()
    : top5;

  result.id = result._id?.toString() ?? result.id;

  result.game = await getGameById(
    result.gameId,
  );

  return result;
}

export const resolvers = {
  // QUERY
  games: async () => {
    return getGames();
  },

  game: async (_, { id }) => {
    return getGameById(id);
  },

  me: async (_, __, context) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return {
      ...user,
      id: user._id.toString(),
    };
  },

  library: async (_, __, context) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const library = await Library.findOne({
      userId,
    });

    if (!library) {
      return null;
    }

    return populateLibrary(library);
  },

  ratings: async (_, __, context) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const ratings = await Rating.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return Promise.all(
      ratings.map(populateRating),
    );
  },

  ratingsByGame: async (
    _,
    { gameId },
    context,
  ) => {
    requireAuthenticatedUser(context);

    const ratings = await Rating.find({
      gameId,
    }).sort({
      createdAt: -1,
    });

    return Promise.all(
      ratings.map(populateRating),
    );
  },

  top5: async (_, __, context) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const top5 = await Top5.find({
      userId,
    }).sort({
      position: 1,
    });

    return Promise.all(
      top5.map(populateTop5),
    );
  },

  // MUTATIONS

  addGameToLibrary: async (
    _,
    { gameId },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    let library = await Library.findOne({
      userId,
    });

    if (!library) {
      library = await Library.create({
        userId,
        games: [
          {
            gameId,
            status: "want_to_play",
          },
        ],
      });

      return populateLibrary(library);
    }

    const alreadyExists =
      library.games.some(
        (game) =>
          game.gameId === Number(gameId),
      );

    if (alreadyExists) {
      throw new Error(
        "Esse jogo já está na sua biblioteca",
      );
    }

    library.games.push({
      gameId,
      status: "want_to_play",
    });

    await library.save();

    return populateLibrary(library);
  },

  updateLibraryGame: async (
    _,
    { gameId, status },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const library = await Library.findOne({
      userId,
    });

    if (!library) {
      throw new Error(
        "Biblioteca não encontrada",
      );
    }

    const game = library.games.find(
      (item) =>
        item.gameId === Number(gameId),
    );

    if (!game) {
      throw new Error(
        "Jogo não encontrado na biblioteca",
      );
    }

    game.status = status;

    await library.save();

    return {
      gameId: game.gameId,
      status: game.status,
      game: await getGameById(game.gameId),
    };
  },

  removeGameFromLibrary: async (
    _,
    { gameId },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const library = await Library.findOne({
      userId,
    });

    if (!library) {
      throw new Error(
        "Biblioteca não encontrada",
      );
    }

    const gameIndex =
      library.games.findIndex(
        (game) =>
          game.gameId === Number(gameId),
      );

    if (gameIndex === -1) {
      throw new Error(
        "Jogo não encontrado na biblioteca",
      );
    }

    library.games.splice(gameIndex, 1);

    await library.save();

    return populateLibrary(library);
  },

  createRating: async (
    _,
    { gameId, rating, review },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    if (rating < 1 || rating > 5) {
      throw new Error(
        "A avaliação deve estar entre 1 e 5",
      );
    }

    try {
      const created = await Rating.create({
        userId,
        gameId,
        rating,
        review: review ?? null,
      });

      return populateRating(created);
    } catch (error) {
      if (error?.code === 11000) {
        throw new Error(
          "Você já avaliou esse jogo",
        );
      }

      throw error;
    }
  },

  updateRating: async (
    _,
    { id, rating, review },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    if (rating < 1 || rating > 5) {
      throw new Error(
        "A avaliação deve estar entre 1 e 5",
      );
    }

    const updated =
      await Rating.findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        {
          rating,
          review: review ?? null,
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!updated) {
      throw new Error(
        "Avaliação não encontrada",
      );
    }

    return populateRating(updated);
  },

  deleteRating: async (
    _,
    { id },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const result =
      await Rating.deleteOne({
        _id: id,
        userId,
      });

    if (result.deletedCount === 0) {
      throw new Error(
        "Avaliação não encontrada",
      );
    }

    return true;
  },

  setTop5: async (
    _,
    { gameId, position },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    if (position < 1 || position > 5) {
      throw new Error(
        "A posição deve estar entre 1 e 5",
      );
    }

    const existingPosition =
      await Top5.findOne({
        userId,
        position,
      });

    let top5;

    if (existingPosition) {
      existingPosition.gameId = gameId;

      top5 = await existingPosition.save();
    } else {
      try {
        top5 = await Top5.create({
          userId,
          gameId,
          position,
        });
      } catch (error) {
        if (error?.code === 11000) {
          throw new Error(
            "Esse jogo já está no seu Top 5",
          );
        }

        throw error;
      }
    }

    return populateTop5(top5);
  },

  removeTop5: async (
    _,
    { position },
    context,
  ) => {
    const userId = requireAuthenticatedUser(
      context,
    );

    const result =
      await Top5.deleteOne({
        userId,
        position,
      });

    if (result.deletedCount === 0) {
      throw new Error(
        "Posição não encontrada",
      );
    }

    return true;
  },
};