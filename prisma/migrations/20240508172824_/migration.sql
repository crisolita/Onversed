-- CreateEnum
CREATE TYPE "PRENDA" AS ENUM ('ABRIGOS_BLAZERS', 'ACCESORIOS', 'BANADORES_BIKINIS', 'BOLSOS', 'CAMISAS', 'CAMISETAS_POLOS', 'CARDIGANS_JERSEYS', 'CHAQUETAS_CAZADORAS', 'FALDAS', 'JEANS_PANTALONES', 'JOYAS_BISUTERIE', 'SHORTS_BERMUDAS', 'SPORT', 'SUDADERAS', 'TOPS_BODIES', 'TRAJES_SMOKING', 'VESTIDOS', 'VESTIDO_INVITADAS');

-- AlterTable
ALTER TABLE "designRequest" ADD COLUMN     "prenda" "PRENDA";

-- CreateTable
CREATE TABLE "relationPrendaPrecio" (
    "id" SERIAL NOT NULL,
    "producto" "PRODUCTO" NOT NULL,
    "prenda" "PRENDA" NOT NULL,

    CONSTRAINT "relationPrendaPrecio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "relationPrendaPrecio_producto_key" ON "relationPrendaPrecio"("producto");

-- CreateIndex
CREATE UNIQUE INDEX "relationPrendaPrecio_prenda_key" ON "relationPrendaPrecio"("prenda");
