import { Router } from "express"
import { agregarEncuesta, Votar, listarEncuestas, listarEncuestasId, eliminarEncuesta } from "../controllers/encuesta.controller.js"
import { validarOpciones } from "../middlewares/validacionesMiddleware.js"


const router = Router()


router.post("/encuestas", validarOpciones, agregarEncuesta)
router.post("/encuestas/:id/votar", Votar)
router.get("/encuestas", listarEncuestas)
router.get("/encuestas/:id", listarEncuestasId)
router.delete("/encuestas/:id", eliminarEncuesta)

export default router
