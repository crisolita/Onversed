/*
  Warnings:

  - You are about to drop the column `priceInstagram` on the `priceFormato` table. All the data in the column will be lost.
  - You are about to drop the column `priceRoblox` on the `priceFormato` table. All the data in the column will be lost.
  - You are about to drop the column `priceSnap` on the `priceFormato` table. All the data in the column will be lost.
  - You are about to drop the column `priceTiktok` on the `priceFormato` table. All the data in the column will be lost.
  - You are about to drop the column `priceZepeto` on the `priceFormato` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "FormatDesign" ADD VALUE 'SNAP';

-- AlterTable
ALTER TABLE "priceFormato" DROP COLUMN "priceInstagram",
DROP COLUMN "priceRoblox",
DROP COLUMN "priceSnap",
DROP COLUMN "priceTiktok",
DROP COLUMN "priceZepeto";
