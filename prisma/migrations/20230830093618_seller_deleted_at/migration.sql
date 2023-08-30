/*
  Warnings:

  - You are about to drop the column `isActive` on the `sellers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "isActive",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
