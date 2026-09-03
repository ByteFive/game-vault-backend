import jwt from "jsonwebtoken";

export function createContext(request) {
  const req = request.raw ?? request;

  const token = req.cookies?.token;

  if (!token) {
    return {
      user: null,
    };
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    return {
      user: payload,
    };
  } catch {
    return {
      user: null,
    };
  }
}

export function requireAuth(context) {
  if (!context.user) {
    throw new Error("Autenticação necessária");
  }

  return context.user;
}