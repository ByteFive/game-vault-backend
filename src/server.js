import express from "express";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import ratingRoutes from "./routes/rating.js";
import gameRoutes from "./routes/game.js";
import libraryRoutes from "./routes/library.js"
import top5Routes from "./routes/top5.js";
import { connectDatabase } from "./lib/db.js";
import cookieParser from "cookie-parser";
import "dotenv/config.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDatabase();

app.use(authRoutes);
app.use(profileRoutes);
app.use(ratingRoutes);
app.use( gameRoutes );
app.use(libraryRoutes);
app.use(top5Routes);
app.use(gameRoutes);

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});