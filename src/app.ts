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


const FRONT_URL_DEV      = "http://localhost:5173"
const FRONT_URL_NETLIFY  = "https://foodconnectweb.netlify.app"

const whitelist = [FRONT_URL_DEV, FRONT_URL_NETLIFY]


app.use(cors({
  origin: whitelist,
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
