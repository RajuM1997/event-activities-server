-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'Khulna',
ADD COLUMN     "bio" TEXT DEFAULT 'good every',
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '0199999999';
