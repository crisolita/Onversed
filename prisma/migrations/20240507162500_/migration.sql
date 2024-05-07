-- CreateEnum
CREATE TYPE "PRODUCTO" AS ENUM ('A', 'B', 'C');

-- AlterTable
ALTER TABLE "designRequest" ADD COLUMN     "productType" "PRODUCTO";

-- CreateTable
CREATE TABLE "priceProducto" (
    "id" SERIAL NOT NULL,
    "producto" "PRODUCTO" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "priceProducto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "priceProducto_producto_key" ON "priceProducto"("producto");
