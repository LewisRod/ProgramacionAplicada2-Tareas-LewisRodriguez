import prisma from "../db.js";

export const crearTurno = async (req, res) => {
  const { cliente, servicio} = req.body;

  const turno = await prisma.turnos.create({
    data: { cliente, servicio},
  });

  res.status(201).json(turno);
};


export const listaTurnos = async (req, res) => {
  const turno = await prisma.turnos.findMany();

  res.json(turno);
};



export const verSiguiente = async (req, res) => {
  const buscarTurno = await prisma.turnos.findFirst({
    where: { estado: "esperando" },
  });

  if (buscarTurno.estado != "esperando") {
    return res.status(404).json({ error: "no hay en estado de espera" });
  }

  res.json(buscarTurno);
};



export const llamarSiguiente = async (req, res) => {
  const actual = await prisma.turnos.findFirst({
    where: { estado: "atendiendo" },
  });

  if (actual) {
    return res.status(400).json({ error: "ya hay uno atendido" });
  }

  const siguiente = await prisma.turnos.findFirst({
    where: { estado: "esperando" },
  });

  if (!siguiente) {
    return res.status(404).json({ error: "no hay en espera" });
  }

  const turnoActualizado = await prisma.turnos.update({
    where: { id: siguiente.id },
    data: { estado: "atendiendo" },
  });

  res.json(turnoActualizado);
};


export const finalizarTurno = async (req, res) => {
  const turno = await prisma.turnos.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!turno) {
    return res.status(404).json({ mensaje: "turno no registrado" });
  }

  const finalizarTurno = await prisma.turnos.update({
    where: { id: turno.id },
    data: { estado: "finalizado" },
  });

  res.json(finalizarTurno)
}



export const Esperando = async (req, res) => {
  const esperando = await prisma.turnos.count({
    where: { estado: "esperando"}
  });

  res.json(esperando)
}