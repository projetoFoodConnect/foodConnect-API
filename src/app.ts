import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/userRoutes";
import produtoRoutes from "./routes/procuctRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", usuarioRoutes);
app.use("/api", produtoRoutes);

app.get("/", (req, res) => {
  res.send("API FoodConnect rodando!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});