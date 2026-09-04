import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import ratingRoutes from "./routes/rating.js";
import gameRoutes from "./routes/game.js";
import libraryRoutes from "./routes/library.js";
import top5Routes from "./routes/top5.js";
import { createHandler } from "graphql-http/lib/use/express";
import { connectDatabase } from "./lib/db.js";
import { schema } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { createContext } from "./graphql/context.js";

import "dotenv/config.js";

const app = express();

app.use(cors);
app.use(express.json());
app.use(cookieParser());

connectDatabase();

// REST
app.use(authRoutes);
app.use(profileRoutes);
app.use(ratingRoutes);
app.use(gameRoutes);
app.use(libraryRoutes);
app.use(top5Routes);

// GRAPHQL
app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: resolvers,
    context: (request) => createContext(request),
  }),
);

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);

  console.log(`GraphQL disponível em http://127.0.0.1:${PORT}/graphql`);
});
