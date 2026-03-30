/*
  Warnings:

  - Added the required column `shippingAddressSnapshot` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "shippingAddressSnapshot" TEXT NOT NULL,
ADD COLUMN     "trackingNumber" TEXT;
