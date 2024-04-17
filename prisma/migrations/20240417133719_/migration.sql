/*
  Warnings:

  - You are about to drop the column `metaverso` on the `designRequest` table. All the data in the column will be lost.
  - You are about to drop the column `redes` on the `designRequest` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FormatDesign" ADD VALUE 'INSTAGRAM';
ALTER TYPE "FormatDesign" ADD VALUE 'TIKTOK';
ALTER TYPE "FormatDesign" ADD VALUE 'ROBLOX';
ALTER TYPE "FormatDesign" ADD VALUE 'ZEPETO';

-- AlterTable
ALTER TABLE "designRequest" DROP COLUMN "metaverso",
DROP COLUMN "redes";

-- DropEnum
DROP TYPE "Metaverso";

-- DropEnum
DROP TYPE "RRSS";
