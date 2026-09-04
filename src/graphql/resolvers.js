import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getGames, getGameById } from "../services/game.js";
import {
  addGameToLibrary,
  getLibrary,
  updateLibraryGame,
  deleteGameFromLibrary,
} from "../services/library.js";
import { getProfile } from "../services/profile.js";
import {
  getAllByUser,
  getAllByGameId,
  createRating,
  updateRating,
  deleteRating,
} from "../services/rating.js";
import {
  getTop5ByUserId,
  createTop5,
  updateTop5,
  deleteTop5,
} from "../services/top5.js";

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
    createdAt: user.createdAt?.toISOString?.() ?? null,
    updatedAt: user.updatedAt?.toISOString?.() ?? null,
  };
}

async function normalizeLibrary(library) {
  if (!library) return null;

  const games = await Promise.all(
    library.games.map(async (libraryGame) => ({
      gameId: libraryGame.gameId,
      status: libraryGame.status,
      game: await getGameById(libraryGame.gameId),
    })),
  );

  return {
    id: library._id?.toString(),
    userId: library.userId?.toString(),
    games,
    createdAt: library.createdAt?.toISOString?.() ?? null,
    updatedAt: library.updatedAt?.toISOString?.() ?? null,
  };
}

async function normalizeRating(rating) {
  if (!rating) return null;

  return {
    id: rating._id?.toString(),
    userId: rating.userId?.toString(),
    gameId: rating.gameId,
    rating: rating.rating,
    comment: rating.comment ?? null,
    game: await getGameById(rating.gameId),
    createdAt: rating.createdAt?.toISOString?.() ?? null,
    updatedAt: rating.updatedAt?.toISOString?.() ?? null,
  };
}

async function normalizeTop5(top5) {
  if (!top5) return null;

  return {
    id: top5._id?.toString(),
    userId: top5.userId?.toString(),
    gameId: top5.gameId,
    position: top5.position,
    game: await getGameById(top5.gameId),
    createdAt: top5.createdAt?.toISOString?.() ?? null,
    updatedAt: top5.updatedAt?.toISOString?.() ?? null,
  };
}

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
}

function setAuthCookie(res, token) {
  if (!res) {
    throw new Error("Resposta HTTP indisponível");
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
}

function requireAuth(context) {
  if (!context?.user?.userId) {
    throw new Error("Authentication required");
  }

  return context.user;
}

export const resolvers = {
  games: async () => {
    return await getGames();
  },

  game: async ({ id }) => {
    return await getGameById(id);
  },

  me: async (_, context) => {
    const user = requireAuth(context);

    const foundUser = await User.findById(user.userId);

    if (!foundUser) {
      throw new Error("Usuário não encontrado");
    }

    return normalizeUser(foundUser);
  },

  profile: async (_, context) => {
    const user = requireAuth(context);

    return await getProfile(user.userId);
  },

  library: async (_, context) => {
    const user = requireAuth(context);

    const library = await getLibrary(user.userId);

    return await normalizeLibrary(library);
  },

  ratings: async (_, context) => {
    const user = requireAuth(context);

    const ratings = await getAllByUser(user.userId);

    return await Promise.all(ratings.map((rating) => normalizeRating(rating)));
  },

  ratingsByGame: async ({ gameId }, context) => {
    requireAuth(context);

    const ratings = await getAllByGameId(gameId);

    return await Promise.all(ratings.map((rating) => normalizeRating(rating)));
  },

  top5: async (_, context) => {
    const user = requireAuth(context);

    const top5 = await getTop5ByUserId(user.userId);

    return await Promise.all(top5.map((item) => normalizeTop5(item)));
  },

  register: async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new Error("Nome, email e senha são obrigatórios");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      message: "Usuário criado com sucesso",
      user: normalizeUser(user),
    };
  },

  login: async ({ email, password }, context) => {
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new Error("Email ou senha inválidos");
    }

    const token = createToken(user);

    setAuthCookie(context?.res, token);

    return {
      message: "Login successful",
    };
  },

  addGameToLibrary: async ({ gameId }, context) => {
    const user = requireAuth(context);

    const library = await addGameToLibrary(user.userId, gameId);

    return await normalizeLibrary(library);
  },

  updateLibraryGame: async ({ gameId, status }, context) => {
    const user = requireAuth(context);

    const game = await updateLibraryGame(user.userId, gameId, status);

    return {
      message: "Jogo atualizado com sucesso",
      game: {
        gameId: game.gameId,
        status: game.status,
        game: await getGameById(game.gameId),
      },
    };
  },

  removeGameFromLibrary: async ({ gameId }, context) => {
    const user = requireAuth(context);

    const library = await deleteGameFromLibrary(user.userId, gameId);

    return {
      message: "Jogo removido da biblioteca com sucesso",
      library: await normalizeLibrary(library),
    };
  },

  createRating: async ({ gameId, rating, comment }, context) => {
    const user = requireAuth(context);

    const newRating = await createRating({
      userId: user.userId,
      gameId,
      rating,
      comment: comment ?? null,
    });

    return await normalizeRating(newRating);
  },

  updateRating: async ({ id, rating, comment }, context) => {
    const user = requireAuth(context);

    const updatedRating = await updateRating(id, user.userId, {
      rating,
      comment: comment ?? null,
    });

    if (!updatedRating) {
      throw new Error("Avaliação não encontrada");
    }

    return await normalizeRating(updatedRating);
  },

  deleteRating: async ({ id }, context) => {
    const user = requireAuth(context);

    const result = await deleteRating(id, user.userId);

    if (!result || result.deletedCount === 0) {
      throw new Error("Avaliação não encontrada");
    }

    return {
      message: "Avaliação removida com sucesso",
    };
  },

  createTop5: async ({ gameId, position }, context) => {
    const user = requireAuth(context);

    if (position < 1 || position > 5) {
      throw new Error("A posição deve estar entre 1 e 5");
    }

    const top5 = await createTop5({
      userId: user.userId,
      gameId,
      position,
    });

    return await normalizeTop5(top5);
  },

  updateTop5: async ({ position, newPosition }, context) => {
    const user = requireAuth(context);

    if (position < 1 || position > 5 || newPosition < 1 || newPosition > 5) {
      throw new Error("As posições devem estar entre 1 e 5");
    }

    const result = await updateTop5(user.userId, position, newPosition);

    if (!result) {
      throw new Error("Jogo não encontrado no Top 5");
    }

    const top5 = Array.isArray(result) ? result : [result];

    return {
      message: "Top 5 atualizado com sucesso",
      top5: await Promise.all(top5.map((item) => normalizeTop5(item))),
    };
  },

  removeTop5: async ({ position }, context) => {
    const user = requireAuth(context);

    const result = await deleteTop5(user.userId, position);

    if (!result || result.deletedCount === 0) {
      throw new Error("Jogo não encontrado no Top 5");
    }

    return {
      message: "Jogo removido do Top 5 com sucesso",
    };
  },
};
