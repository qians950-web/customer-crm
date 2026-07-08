-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('INSTALLATION', 'REPAIR', 'OTHER');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "requestType" "RequestType",
ADD COLUMN     "startDate" TIMESTAMP(3);
