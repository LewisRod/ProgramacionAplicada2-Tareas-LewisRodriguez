import prisma from "../db.js"



 export const agregarEncuesta = async (req, res) => {
    const { pregunta, opciones } = req.body
    
    const encuesta = await prisma.encuestas.create({
        data: { pregunta, opciones, votos: opciones.map(() => 0) }
        //se crea un array de votos apartir de la cantidad opciones
    })

    res.json(encuesta)
}


export const Votar = async (req, res) => {
    const id = parseInt(req.params.id)
    
    const buscarEncuesta = await prisma.encuestas.findUnique({
        where: {id}
    })
 
    if (!buscarEncuesta) {
        res.status(404).json({ error: "encuesta no encontrada" })
    } 

    
    const { opcion } = req.body
    
    const indice = buscarEncuesta.opciones.indexOf(opcion)

    if (indice === -1) {
        return res.status(400).json({error: "opcion no encontrada"})
    }

    const votosActualizados = [...buscarEncuesta.votos]

    votosActualizados[indice] += 1

    const encuestaActualizada = await prisma.encuestas.update({
        where: {id}, data: { votos: votosActualizados}
    })

    res.json(encuestaActualizada)

}

export const listarEncuestas = async (req, res) => {
    const encuesta = await prisma.encuestas.findMany()

    res.json(encuesta)
}


export const listarEncuestasId = async (req, res) => {
    const id = parseInt(req.params.id)

    const buscarEncuesta = await prisma.encuestas.findUnique({
        where: {id}
    })

    if (!buscarEncuesta) {
        return res.status(404).json({error: "encuesta no encontrada"})
    }

    res.json(buscarEncuesta)
}


export const eliminarEncuesta = async (req, res) => {
    const id = parseInt(req.params.id)

    const buscarEncuesta = await prisma.encuestas.findUnique({
        where: {id}
    })

      if (!buscarEncuesta) {
        return res.status(404).json({ error: "encuesta no encontrado" });
      }
    
    await prisma.encuestas.delete({
        where: {id}
    })

    res.json({mensaje: "encuesta eliminada"})
}








