import { Router } from "express"
import { listarInventario, agregarProducto, agregarStock, disminuirStock, productosAlerta } from "../controllers/inventario.controller.js"

const router = Router()

router.get("/inventario", listarInventario)
router.post("/inventario", agregarProducto)
router.post("/inventario/:id/entrada", agregarStock)
router.post("/inventario/:id/salida", disminuirStock)
router.get("/inventario/alertas",productosAlerta)



export default router