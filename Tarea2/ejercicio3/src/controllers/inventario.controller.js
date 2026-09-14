import prisma from "../db.js";

export const listarInventario = async (req, res) => {
  const inventario = await prisma.inventarios.findMany();

  res.json(inventario);
};

export const agregarProducto = async (req, res) => {
  const { producto, stock, stockMinimo } = req.body;

  const inventario = await prisma.inventarios.create({
    data: { producto, stock, stockMinimo },
  });

  res.json(inventario);
};
 
export const agregarStock = async (req, res) => {
  const id = parseInt(req.params.id);
  const { cantidad } = req.body;

  const buscarProducto = await prisma.inventarios.findUnique({
    where: { id },
  });

  if (!buscarProducto) {
    return res.status(404).json({ error: "no se encontro producto" });
  }

  buscarProducto.stock += cantidad;

  res.status(201).json(buscarProducto);
};

export const disminuirStock = async (req, res) => {
  const id = parseInt(req.params.id);
  const { cantidad } = req.body;

  const buscarProducto = await prisma.inventarios.findUnique({
    where: { id },
  });

  if (!buscarProducto) {
    return res.status(404).json({ error: "no se encontro producto" });
  }

  if (cantidad > buscarProducto.stock)
    return res.status(400).json({ Error: "stock insuficiente" });

  buscarProducto.stock -= cantidad;

  res.status(201).json(buscarProducto);
};




export const productosAlerta = async (req, res) => {
    const inventario = await prisma.inventarios.findMany()

    const alertas = inventario
        .filter((producto) => producto.stock < producto.stockMinimo)
        .map((producto) => ({
            ...producto,
            faltan: producto.stockMinimo - producto.stock
        }))

    res.json(alertas)
}