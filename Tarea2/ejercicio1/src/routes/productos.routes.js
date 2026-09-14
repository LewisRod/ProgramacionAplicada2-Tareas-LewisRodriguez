import express from "express"
import { listarProductos, agregarProducto, actualizarCantidad, eliminarProducto, calcularTotal, aplicarDescuento } from "../controllers/productos.controller.js";
import { validarNumerosPositivos } from "../middlewares/validaciones.middleware.js";

const router = express.Router()

router.get("/", listarProductos)
router.post("/", validarNumerosPositivos,agregarProducto);
router.put("/:id", actualizarCantidad)
router.delete("/:id", eliminarProducto)

router.get("/total", calcularTotal)
router.post("/aplicarDescuento", aplicarDescuento)

export default router
