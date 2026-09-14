/*
  Warnings:

  - You are about to drop the `Encuesta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Encuesta";

-- CreateTable
CREATE TABLE "Encuestas" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "opciones" TEXT[],
    "votos" INTEGER[],

    CONSTRAINT "Encuestas_pkey" PRIMARY KEY ("id")
);
