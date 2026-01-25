-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventCategory" ADD VALUE 'Hackathon';
ALTER TYPE "EventCategory" ADD VALUE 'Dev_Meetup';
ALTER TYPE "EventCategory" ADD VALUE 'Tech_Talk';
ALTER TYPE "EventCategory" ADD VALUE 'Coding_Workshop';
ALTER TYPE "EventCategory" ADD VALUE 'Networking_Event';
