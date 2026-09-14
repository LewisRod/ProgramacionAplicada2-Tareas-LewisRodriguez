import { Router } from "express";
import { listaTurnos, crearTurno, verSiguiente, llamarSiguiente, finalizarTurno,Esperando } from "../controllers/turnosController.js";


const router = Router()

router.get("/turnos", listaTurnos)
router.post("/turnos", crearTurno)
router.get("/turnos/siguiente", verSiguiente)
router.put("/turnos/llamar", llamarSiguiente)
router.put("/turnos/:id/finalizar", finalizarTurno)
router.get("/turnos/espera", Esperando)

export default router