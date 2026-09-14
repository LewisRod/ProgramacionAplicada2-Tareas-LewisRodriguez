import "dotenv/config"
import express from "express"
import {loggerMiddleware} from "./middlewares/loggerMiddleware.js"
import encuestasRouter from "./routes/encuestas.routes.js";

const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use(encuestasRouter)

app.listen(3000, () => {
  console.log("Servidor ejecutándose en el puerto 3000")
})