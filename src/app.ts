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

// Pegamos as URLs do front do .env
const FRONT_URL_DEV  = process.env.FRONT_URL    || "http://localhost:5173"
const FRONT_URL_PROD = process.env.FRONT_URL_PROD || "https://foodconnectweb.netlify.app/"

const whitelist = [FRONT_URL_DEV, FRONT_URL_PROD]

app.use(
  cors({
    origin: (origin, callback) => {
      // permitir requisições sem origin (Postman, server‐to‐server)
      if (!origin) return callback(null, true)
      // se estiver na whitelist, permite
      if (whitelist.includes(origin)) {
        return callback(null, true)
      }
      // caso contrário, bloqueia
      return callback(new Error(`CORS não autorizado para origem ${origin}`))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json())
app.use(cookieParser())

setupSwagger(app)

app.use("/api", usuarioRoutes)
app.use("/api", produtoRoutes)
app.use("/api", doacaoRoutes)

app.get("/", (req, res) => {
  res.send("API FoodConnect rodando!")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
