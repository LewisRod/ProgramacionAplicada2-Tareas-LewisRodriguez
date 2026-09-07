const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000, () =>
  console.log("Servidor ejecutandose en el servidor 3000"),
);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

let habitos = [
  { id: 1, nombre: "Correr", meta: "Ganar resistencia", registros: [] },
];

let nextId = 2;

app.post("/habitos", (req, res) => {
  const { nombre, meta } = req.body;

  const registroActual = { fecha: new Date(), completado: false };

  const habitoDiario = {
    id: nextId++,
    nombre,
    meta,
    registros: [registroActual],
  };
  habitos.push(habitoDiario);
  res.status(201).json(habitoDiario);
});



app.get("/habitos", (req, res) => {
  res.json(habitos);
});




app.post("/habitos/:id/registrar", (req, res) => {
  const buscarHabito = habitos.find((h) => h.id === parseInt(req.params.id));

  if (!buscarHabito) {
    return res.status(401).json({ messaje: "Habito no registrado" });
  }

  const registro = { fecha: new Date(), completado: true };

  buscarHabito.registros.push(registro);

  return res.status(201).json(registro);
});




app.get("/habitos/:id/estadisticas", (req, res) => {
  const buscarHabito = habitos.find((h) => h.id === parseInt(req.params.id));
  if (!buscarHabito) {
    return res.status(404).json({ mensaje: "Habito no encontrado" });
  }

  const registros = buscarHabito.registros;

  let racha = 0;

  for (let i = registros.length - 1; i >= 0; i--) {
    if (registros[i].completado === true) {
      racha++;
    } else {
      break;
    }
  }
    
    let rachaHistorica = 0;
    let mejorRacha = 0;


      for (const registro of registros) {
        if (registro.completado === true) {
          rachaHistorica++;
        } else {
          rachaHistorica = 0;
        }

        if (rachaHistorica > mejorRacha) {
          mejorRacha = rachaHistorica;
        }
      }
    
    
    const diasCumplidos = registros.filter((registro) => registro.completado === true).length;

    const porcentaje = registros.length > 0 ? (diasCumplidos / registros.length) * 100 : 0;
    

      res.json({rachaActual: racha,mejorRacha, porcentajeCumplimiento: porcentaje});
});



app.delete("/habitos/:id", (req, res) => {
    const posicion = habitos.findIndex((h) => h.id === parseInt(req.params.id))

    if (posicion === -1) { return res.status(401).json({ messaje: "habito no registrado" }) }

    habitos.splice(posicion, 1)
    
   res.status(200).json({mensaje: "ELIMINADAA" });
})