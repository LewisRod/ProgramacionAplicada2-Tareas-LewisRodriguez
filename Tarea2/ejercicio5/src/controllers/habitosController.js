import prisma from "../db.js";

export const crearHabito = async (req, res) => {
  const { nombre, meta } = req.body;

  const habito = await prisma.habitos.create({
    data: { nombre, meta },
  });

  res.status(201).json(habito);
};

export const listarHabitos = async (req, res) => {
  const habitos = await prisma.habitos.findMany();

  res.json(habitos);
};



export const registrarHabito = async (req, res) => {
  const id = parseInt(req.params.id);

  const habito = await prisma.habitos.findUnique({
    where: { id },
  });

  if (!habito) {
    return res.status(404).json({error: "habito no encontrado"});
  }
    
     const fecha = new Date().toISOString()
     const registros = habito.registros;
     const habitoRegistrado = registros.some((registro) => registro.fecha === fecha)

     if (habitoRegistrado) { return res.status(400).json({ error: "el habito ya fue registrado"});
     }
    
    
    const nuevoRegistro = { fecha: fecha, completado: true }

    registros.push(nuevoRegistro);

    const habitoActualizado = await prisma.habitos.update({
      where: { id },
      data: { registros: registros}
    })

    res.json(habitoActualizado)
}




export const estadisticasHabito = async (req, res) => {
  const id = parseInt(req.params.id);

  const habito = await prisma.habitos.findUnique({
    where: { id },
  });

  if (!habito) {
    return res.status(404).json({ error: "habito no encontrado" });
  }

  const registros = habito.registros;

  registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  let rachaActual = 0;

  for (let i = 0; i < registros.length; i++) {
    if (!registros[i].completado) {
      break;
    }

    if (i === 0) {
      rachaActual++;
      continue;
    }

    const fechaActual = new Date(registros[i - 1].fecha);
    const fechaAnterior = new Date(registros[i].fecha);

    const diferencia = fechaActual - fechaAnterior;
    const dias = diferencia / (1000 * 60 * 60 * 24);

    if (dias === 1) {
      rachaActual++;
    } else {
      break;
    }
  }

  let mejorRacha = 0;
  let racha = 0;

  for (let i = 0; i < registros.length; i++) {
    if (!registros[i].completado) {
      racha = 0;
      continue;
    }

    if (i === 0) {
      racha = 1;
    } else {
      const fechaActual = new Date(registros[i - 1].fecha);
      const fechaAnterior = new Date(registros[i].fecha);

      const diferencia = fechaActual - fechaAnterior;
      const dias = diferencia / (1000 * 60 * 60 * 24);

      if (dias === 1) {
        racha++;
      } else {
        racha = 1;
      }
    }

    if (racha > mejorRacha) {
      mejorRacha = racha;
    }
  }

  const completados = registros.filter((registro) => registro.completado);

  const porcentajeCumplimiento =
    registros.length === 0 ? 0 : (completados.length / registros.length) * 100;

  res.json({
    rachaActual,
    mejorRacha,
    porcentajeCumplimiento,
  });
};




export const eliminarHabito = async (req, res) => {
  const id = parseInt(req.params.id);

  const habito = await prisma.habitos.findUnique({
    where: { id }
  });

  if (!habito) {
    return res.status(404).json({error: "habito no encontrado"})
  }

  await prisma.habitos.delete({
    where: { id }
  })

  res.json({
    mensaje: "habito eliminado",
  })
}

