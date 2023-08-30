/*
  Warnings:

  - A unique constraint covering the columns `[companyName]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sellers_companyName_key" ON "sellers"("companyName");
