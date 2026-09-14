-- CreateTable
CREATE TABLE "Habitos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "meta" INTEGER NOT NULL,
    "registros" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Habitos_pkey" PRIMARY KEY ("id")
);
