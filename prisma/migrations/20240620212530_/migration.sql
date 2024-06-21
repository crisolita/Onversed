/*
  Warnings:

  - You are about to drop the column `validated` on the `designRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "validated" BOOLEAN;

-- AlterTable
ALTER TABLE "designRequest" DROP COLUMN "validated";
