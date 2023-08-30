/*
  Warnings:

  - You are about to drop the column `name` on the `admins` table. All the data in the column will be lost.
  - The `gender` column on the `customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `image` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `admins` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyAddress` to the `sellers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyLogo` to the `sellers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `sellers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `sellers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `sellers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('New', 'Used', 'Refurbished');

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "name",
ADD COLUMN     "image" TEXT NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "image" TEXT,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "soldCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "ProductStatus" NOT NULL;

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "companyAddress" TEXT NOT NULL,
ADD COLUMN     "companyLogo" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "status" "SellerStatus" NOT NULL DEFAULT 'Active',
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;
