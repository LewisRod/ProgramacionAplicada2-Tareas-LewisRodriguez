const express = require("express")
const app = express()

app.use(express.json())
app.listen(3000, () => console.log("Servidor ejecutandose en puerto 3000 "))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})


let inventario = [
    {id:1,producto: "Jabon",stock:15,stockMinimo:5}
]

let nextId = 2


app.get("/inventario", (req, res) => {
    res.json(inventario)
})


app.post("/inventario", (req, res) => {
    const { producto, stock, stockMinimo } = req.body
    
    const productoNuevo = { id: nextId++, producto, stock, stockMinimo }

    inventario.push(productoNuevo)

    res.status(201).json(productoNuevo)
})

app.post("/inventario/:id/entrada", (req, res) => {
    const buscarProducto = inventario.find((i) => i.id === parseInt(req.params.id))
    const {cantidad} = req.body

    if (!buscarProducto) { return res.status(400).json({ Error: "El producto no se encuentra" }) }
    
    buscarProducto.stock += req.body.cantidad
    
    res.status(201).json(buscarProducto)

})


app.post("/inventario/:id/salida", (req, res) => {
    const buscarProducto = inventario.find((i) => i.id === parseInt(req.params.id))
    const { cantidad } = req.body
    
    if (!buscarProducto) return res.status(400).json({ Error: "producto no encontrado" })
    if (cantidad > buscarProducto.stock) return res.status(400).json({ Error: "stock insuficiente" });
    
    buscarProducto.stock -= req.body.cantidad

      res.status(201).json(buscarProducto);
})


app.get("/inventario/alertas", (req, res) => {
  const alertas = inventario.filter((producto) => producto.stock <= producto.stockMinimo)

  if (alertas.length > 0) {
    return res.status(201).json(alertas);
  }

  return res.status(200).json({
    mensaje: "no hay productos con stock bajo",
  });
});

