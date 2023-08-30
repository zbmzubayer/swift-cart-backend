-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Processing', 'Delivered', 'Cancelled', 'Refunded', 'Failed');

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Pending',
ALTER COLUMN "total" SET DEFAULT 0;
