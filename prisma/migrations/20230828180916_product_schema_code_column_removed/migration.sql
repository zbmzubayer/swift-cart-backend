/*
  Warnings:

  - You are about to drop the column `code` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,sellerId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "products_code_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "code";

-- CreateIndex
CREATE UNIQUE INDEX "products_name_sellerId_key" ON "products"("name", "sellerId");
