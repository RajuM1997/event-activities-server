/*
  Warnings:

  - You are about to drop the column `userEmail` on the `locations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userProfileId]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userProfileId` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_userEmail_fkey";

-- DropIndex
DROP INDEX "locations_userEmail_key";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "userEmail",
ADD COLUMN     "userProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "locations_userProfileId_key" ON "locations"("userProfileId");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
