/*
  Warnings:

  - The values [Roblox] on the enum `Metaverso` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Metaverso_new" AS ENUM ('ROBLOX', 'ZEPETO');
ALTER TABLE "designRequest" ALTER COLUMN "metaverso" TYPE "Metaverso_new" USING ("metaverso"::text::"Metaverso_new");
ALTER TYPE "Metaverso" RENAME TO "Metaverso_old";
ALTER TYPE "Metaverso_new" RENAME TO "Metaverso";
DROP TYPE "Metaverso_old";
COMMIT;

-- CreateTable
CREATE TABLE "priceFormato" (
    "id" SERIAL NOT NULL,
    "formato" "FormatDesign" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceInstagram" DOUBLE PRECISION,
    "priceTiktok" DOUBLE PRECISION,
    "priceSnap" DOUBLE PRECISION,
    "priceRoblox" DOUBLE PRECISION,
    "priceZepeto" DOUBLE PRECISION,

    CONSTRAINT "priceFormato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "priceFormato_formato_key" ON "priceFormato"("formato");
