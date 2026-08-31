import express from "express";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import "dotenv/config.js";
import { connectDatabase } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDatabase();

app.use(authRoutes);
app.use(profileRoutes);

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});