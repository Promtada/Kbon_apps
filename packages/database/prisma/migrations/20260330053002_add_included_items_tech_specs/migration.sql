-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "includedItems" JSONB,
ADD COLUMN     "techSpecs" JSONB;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reviewerName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
