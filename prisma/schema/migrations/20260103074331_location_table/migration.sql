/*
  Warnings:

  - You are about to drop the column `userId` on the `locations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_userId_fkey";

-- DropIndex
DROP INDEX "locations_userId_key";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "locations_userEmail_key" ON "locations"("userEmail");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
