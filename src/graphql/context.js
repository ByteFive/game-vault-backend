import jwt from "jsonwebtoken";

export function createContext(request) {
  const req = request.raw ?? request;

  const res = request.context?.res;

  const token = req.cookies?.token;

  if (!token) {
    return {
      req,
      res,
      user: null,
    };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return {
      req,
      res,
      user: payload,
    };
  } catch (error) {
    return {
      req,
      res,
      user: null,
    };
  }
}

export function requireAuth(context) {
  if (!context.user?.userId) {
    throw new Error("Autenticação necessária");
  }

  return context.user;
}
