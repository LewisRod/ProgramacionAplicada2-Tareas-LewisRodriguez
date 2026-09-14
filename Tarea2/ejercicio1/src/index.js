import "dotenv/config"
import express from "express"
import productosRoutes from "./routes/productos.routes.js"
import { loggerMiddleware } from "./middlewares/logger.middleware.js";

const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use("/productos", productosRoutes)

app.listen(3000, () => {
    console.log("Servidor ejecutandose en el servidor 3000")
})