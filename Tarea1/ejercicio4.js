const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000, () => console.log("Servidor ejecutandose en el puerto 3000"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

let turnos = [
  { id: 1, cliente: "Mario", servicio: "Cerquillo", estado: "atendiendo" },
];

let nextId = 2;

app.post("/turnos", (req, res) => {
  const { cliente, servicio, estado } = req.body;
  const nuevoTurno = { id: nextId++, cliente, servicio, estado };
  turnos.push(nuevoTurno);
  res.status(201).json(nuevoTurno);
});

app.get("/turnos", (req, res) => {
  res.json(turnos);
});


app.get("/turnos/siguiente", (req, res) => {
  const siguienteTurno = turnos.find((t) => t.estado === "esperando");
  res.json(siguienteTurno);
});



app.put("/turnos/llamar", (req, res) => {
  const actual = turnos.filter((t) => t.estado === "atendiendo");
  const siguienteTurno = turnos.find((t) => t.estado === "esperando");

  if (actual.length > 0) {
    return res.status(404).json({ mensaje: "solo puede haber uno atendiendo" });
  } else if (siguienteTurno) {
    siguienteTurno.estado = "atendiendo";
    res.json(siguienteTurno);
  } else {
    res.status(404).json({ mensaje: "no hay turnos esperando" });
  }
});



app.put("/turnos/:id/finalizar", (req, res) => {
    const siguienteTurno = turnos.find((t) => t.id === parseInt(req.params.id))
    
    if (!siguienteTurno) {
        return res.status(400).json({messaje: "turno no registrado"})
    }

    siguienteTurno.estado = "finalizado"

    res.json(siguienteTurno);
    
})


app.get("/turnos/espera", (req, res) => {
    const esperando = turnos.filter((t) => t.estado === "esperando")

    const turnosEnEspera = esperando.length

    res.json(turnosEnEspera)
})