-- AlterEnum
ALTER TYPE "PRENDA" ADD VALUE 'OTROS';

-- AlterTable
ALTER TABLE "userProfile" ADD COLUMN     "municipio" TEXT,
ADD COLUMN     "provincia" TEXT;
