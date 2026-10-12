import { Router } from "express";
import { registro, login, verificarSesion } from "../controllers/auth.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);
router.get("/verificar", verificarToken, verificarSesion);

export default router;
