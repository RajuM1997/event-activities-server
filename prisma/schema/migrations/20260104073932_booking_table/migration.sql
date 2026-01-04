-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('BOOKED', 'CANCELLED');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'BOOKED';
