import prisma from "../db.js"



export const listarProductos = async (req, res) => {
    const productos = await prisma.productos.findMany()

    res.json(productos)
}



export const agregarProducto = async (req, res) => {
    const { nombre, precio, cantidad } = req.body
    
    const buscarProducto = await prisma.productos.findFirst({
        where: { nombre }
    })

    if (buscarProducto) {
        const producto = await prisma.productos.update({
            where: { id: buscarProducto.id },
            data: { cantidad: buscarProducto.cantidad + cantidad}
        })
        return res.json(producto)
    }

    const producto = await prisma.productos.create({
        data: {nombre,precio,cantidad}
    })

    res.status(201).json(producto)
}





export const actualizarCantidad = async (req, res) => {
    const id = parseInt(req.params.id)
    const { cantidad } = req.body
    
    const buscarProducto = await prisma.productos.findUnique({
        where: {id}
    })

    if (!buscarProducto) {
        return res.status(404).json({error: "Producto no encontrado"})
    }

    const producto = await prisma.productos.update({
        where: {id}, data: {cantidad}
    })

    res.json(producto)
}




export const eliminarProducto = async (req, res) => {
    const id = parseInt(req.params.id)

    const buscarProducto = await prisma.productos.findUnique({
        where: {id}
    })

    if (!buscarProducto) {
        return res.status(404).json({error: "producto no encontrado"})
    }

    await prisma.productos.delete({
        where: {id}
    })

    res.json({mensaje: "Producto eliminado"})
}






export const calcularTotal = async (req, res) => {
    const productos = await prisma.productos.findMany()

    const total = productos.reduce((acomulado, producto) => acomulado + producto.precio * producto.cantidad, 0)
    
    res.json(total)
}





export const aplicarDescuento = async (req, res) => {
    const { porcentaje } = req.body
    
    if (porcentaje > 50) {
      return res.status(400).json({ error: "el descuento no puede ser mayor de 50"})
    }

    const productos = await prisma.productos.findMany()
    

    const total = productos.reduce((acumulado, producto) => acumulado + producto.precio * producto.cantidad, 0)
    
    const descuento = total * (porcentaje / 100)
    const totalConDescuento = total - descuento

     res.json(total,totalConDescuento)

}