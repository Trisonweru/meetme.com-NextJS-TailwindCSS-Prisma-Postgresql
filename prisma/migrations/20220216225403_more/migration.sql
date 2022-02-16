-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_attendeeId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_userId_fkey";

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
