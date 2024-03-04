-- CreateEnum
CREATE TYPE "FormatDesign" AS ENUM ('FACTORY_3D', 'MARKETING_3DAVATAR', 'MARKETING_3D', 'RENDER_360', 'RENDER_RUNWAY', 'OTRO');

-- CreateEnum
CREATE TYPE "RRSS" AS ENUM ('INSTAGRAM', 'TIKTOK', 'SNAP');

-- CreateEnum
CREATE TYPE "Metaverso" AS ENUM ('Roblox', 'ZEPETO');

-- CreateEnum
CREATE TYPE "STATUSREQUEST" AS ENUM ('BORRADOR', 'PAGO_PENDIENTE', 'ENVIADO', 'EN_PROCESO', 'ENTREGADO', 'REVISION', 'FINALIZADO');

-- CreateTable
CREATE TABLE "collections" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designRequest" (
    "id" SERIAL NOT NULL,
    "request_user" INTEGER NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,
    "format" "FormatDesign" NOT NULL,
    "otro" TEXT,
    "redes" "RRSS",
    "metaverso" "Metaverso",
    "model_nft" TEXT,
    "status" "STATUSREQUEST" NOT NULL,

    CONSTRAINT "designRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "designRequest_SKU_key" ON "designRequest"("SKU");

-- AddForeignKey
ALTER TABLE "designRequest" ADD CONSTRAINT "designRequest_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designRequest" ADD CONSTRAINT "designRequest_request_user_fkey" FOREIGN KEY ("request_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
