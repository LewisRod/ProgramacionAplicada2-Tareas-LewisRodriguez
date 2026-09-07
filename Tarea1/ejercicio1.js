const express = require("express");
const app = express();

app.use(express.json());
app.listen(3000, () => console.log("Servidor ejecutandose en puerto 3000"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const validarNumerosPositivos = (req, res, next) => {
  if (req.body.cantidad < 0 || req.body.precio < 0) {
    return res
      .status(400)
      .json({ error: "Precio y cantidad no pueden ser negativos" });
  }
  next();
};



let productos = [{ id: 1, nombre: "Cachu", precio: 350, cantidad: 3 }];

let nextId = 2;




app.get("/productos", (req, res) => {
  res.json(productos);
});



app.get("/productos/total", (req, res) => {
    const resultado = productos.map((producto) => ({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
      total: producto.precio * producto.cantidad,
    }));

    res.json(resultado);
})



app.post("/productos", validarNumerosPositivos, (req, res) => {
  const { nombre, precio, cantidad } = req.body;
  const duplicado = productos.find((p) => p.nombre === nombre);

  if (duplicado) {
    duplicado.cantidad += req.body.cantidad;
    return res.status(201).json(duplicado);
  } 
  
  const producto = { id: nextId++, nombre, precio, cantidad };
  productos.push(producto);
  
  res.status(201).json(producto);
});




app.post("/productos/descuento",validarNumerosPositivos,(req, res) => {

  const { porcentaje } = req.body;
  
  if (porcentaje > 50) { return res.status(400).json({ Error: "El porcentaje no puede ser mayor a 50" }) }
  
    const total = productos.reduce((acomulado, producto) => {
      return acomulado + producto.precio * producto.cantidad;
    }, 0)
  
  const descuento = total * (porcentaje / 100)
  
  const totalConDescuento = total - descuento
  res.json({ total, descuento, totalConDescuento })
})




app.put("/productos/:id", validarNumerosPositivos, (req, res) => {
  const producto = productos.find((p) => p.id === parseInt(req.params.id));

  if (!producto) {
    return res.status(400).json({ Error: "Producto no encontrado" });
    } 
    
    const { nombre, precio, cantidad } = req.body
    
    if (nombre !== undefined) producto.nombre = nombre
    if (precio !== undefined) producto.precio = precio
    if (cantidad !== undefined) producto.cantidad = cantidad
    
    res.json(producto)
});



app.delete("/productos/:id",(req, res) => { 
    const posicion = productos.findIndex((p) => p.id === parseInt(req.params.id))

    if (posicion === -1) 
        return res.status(404).json({ Error: "Producto no encontrado" })
    
    productos.splice(posicion, 1)

    res.json({ mensaje: "Eliminada" });
    
})