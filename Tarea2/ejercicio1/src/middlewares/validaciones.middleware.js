export const validarNumerosPositivos = (req, res, next) => {
  if (req.body.cantidad < 0 || req.body.precio < 0) {
    return res
      .status(400)
      .json({ error: "Precio y cantidad no pueden ser negativos" });
  }
  next();
};

