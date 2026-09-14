import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middleware/loggerMiddleware.js"
import habitosRouter from "./routes/habitosRouter.js"

const app = express();

app.use(express.json());
app.use(loggerMiddleware)
app.use(habitosRouter)

app.listen(3000, () => {
  console.log("Servidor ejecutandose en el puerto 3000");
});
