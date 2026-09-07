const express = require("express")
const app = express()


app.use(express.json())
app.listen(3000, () => console.log("Servidor en puerto 3000"))


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

const validarOpciones = (req, res, next) => {
    if (req.body.opciones.length < 2) {
      return res.status(400).json({ Error: "Debe crear mas de 1 opcion" });
    }

    next()
}


let encuestas = [
  {
    id: 1,
    pregunta: "Quien ganara?",
    opciones: [
      { nombre: "prm", votos: 0 },
      { nombre: "prd", votos: 0 },
      { nombre: "Alofoke", votos: 0 },
    ]
  },
];

let nextId = 2


app.post("/encuestas", validarOpciones, (req, res) => {
    const { pregunta, opciones } = req.body
    const encuesta = { id: nextId++, pregunta, opciones }
    encuestas.push(encuesta)
    res.status(201).json(encuesta)
})




app.post("/encuestas/:id/votar", (req, res) => {
  const encuesta = encuestas.find((e) => e.id === parseInt(req.params.id));

  if (!encuesta) {
    return res.status(400).json({Error: "Encuesta no encontrada"})
  }

  const { opcion } = req.body;

  const opcionSeleccionada = encuesta.opciones.find((o) => o.nombre === opcion);

  if (!opcionSeleccionada) {
    return res.status(400).json({ Error: "Esa opcion no está"})
  }

    opcionSeleccionada.votos++;

    const totalVotos = encuesta.opciones.reduce((acomulador, o) => acomulador + o.votos, 0);
    
    const porcentaje = encuesta.opciones.map((o) => ({
      nombre: o.nombre,
      votos: o.votos,
      porcentaje: totalVotos === 0 ? 0 : (o.votos / totalVotos) * 100
    }));

    encuesta.opciones = porcentaje;

  res.json(opcionSeleccionada,porcentaje)
})





app.get("/encuestas", (req, res) => {
    return res.json(encuestas)
})





app.get("/encuestas/:id/resultados", (req,res) => {
    const encuesta = encuestas.find((e) => e.id === parseInt(req.params.id))
    if (!encuesta) return res.status(400).json({ Error: "no se encuentra ese resultado" })
    
    return res.json(encuesta)
})


app.delete("/encuestas/:id", (req, res) => {
    const posicion = encuestas.findIndex((e) => e.id === parseInt(req.params.id))

    if (posicion === -1) {
        return res.status(404).json({ Error: "Encuesta no encontrada" });
    }
    encuestas.splice(posicion, 1)
    
res.status(200).json({mensaje: "ELIMINADA"})
})