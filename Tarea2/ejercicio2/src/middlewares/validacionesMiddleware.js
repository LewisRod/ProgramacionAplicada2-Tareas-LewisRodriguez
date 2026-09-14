export const validarOpciones = (req, res, next) => {
  if (req.body.opciones.length < 2) {
    return res.status(400).json({ Error: "Debe crear mas de 1 opcion" });
  }

  next();
};
