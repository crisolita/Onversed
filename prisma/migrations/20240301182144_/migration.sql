/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `userProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userProfile_user_id_key" ON "userProfile"("user_id");
