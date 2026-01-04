-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
