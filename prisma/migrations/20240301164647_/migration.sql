-- CreateEnum
CREATE TYPE "UserRol" AS ENUM ('ADMIN', 'CLIENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "authToken" TEXT,
    "foto_de_perfil" TEXT,
    "domicilio" TEXT,
    "postal_code" TEXT,
    "country" TEXT,
    "cif" TEXT,
    "userol" "UserRol" NOT NULL,
    "nombre_empresa" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
