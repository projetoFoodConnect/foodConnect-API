import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { setupSwagger } from "./utils/swaggerConfig"
import usuarioRoutes from "./routes/userRoutes"
import produtoRoutes from "./routes/procuctRoutes"
import doacaoRoutes from "./routes/donationRoutes"


dotenv.config()
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL_PROD,
  credentials: true,
}))


app.use(express.json())
app.use(cookieParser())

setupSwagger(app)

app.use("/api", usuarioRoutes)
app.use("/api", produtoRoutes)
app.use("/api", doacaoRoutes)

app.get("/", (_req, res) => {
  res.send("API FoodConnect rodando!")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT}`)
)
