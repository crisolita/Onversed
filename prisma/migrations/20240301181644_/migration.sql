/*
  Warnings:

  - You are about to drop the column `cif` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `domicilio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `foto_de_perfil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_empresa` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cif",
DROP COLUMN "country",
DROP COLUMN "domicilio",
DROP COLUMN "foto_de_perfil",
DROP COLUMN "nombre_empresa",
DROP COLUMN "postal_code";

-- CreateTable
CREATE TABLE "userProfile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "foto_de_perfil" TEXT NOT NULL,
    "domicilio" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cif" TEXT,
    "nombre_empresa" TEXT,

    CONSTRAINT "userProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userProfile" ADD CONSTRAINT "userProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
