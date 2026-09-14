-- CreateTable
CREATE TABLE "Encuesta" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "opciones" TEXT[],

    CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("id")
);
