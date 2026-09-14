import { Router } from "express"

import {crearHabito,listarHabitos,registrarHabito,estadisticasHabito,eliminarHabito,} from "../controllers/habitosController.js"

const router = Router();

router.post("/habitos", crearHabito)
router.get("/habitos", listarHabitos)
router.post("/habitos/:id/registrar", registrarHabito)
router.get("/habitos/:id/estadisticas", estadisticasHabito)
router.delete("/habitos/:id", eliminarHabito)

export default router;
