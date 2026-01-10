-- CreateEnum
CREATE TYPE "HostStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "status" "HostStatus" NOT NULL DEFAULT 'PENDING';
