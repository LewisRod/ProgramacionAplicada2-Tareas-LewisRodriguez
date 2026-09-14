import "dotenv/config"
import express from "express"
import { loggerMiddleware } from './middlewares/loggerMiddleware.js'
import turnoRouter from "./routes/turnosRouter.js"

const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use(turnoRouter)

app.listen(3000, () => {
    console.log("Servidor ejecutandose en el puerto 3000")
})