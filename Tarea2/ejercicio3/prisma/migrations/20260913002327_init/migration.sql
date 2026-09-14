-- CreateTable
CREATE TABLE "Inventarios" (
    "id" SERIAL NOT NULL,
    "producto" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "stockMinimo" INTEGER NOT NULL,

    CONSTRAINT "Inventarios_pkey" PRIMARY KEY ("id")
);
