/*
  Warnings:

  - You are about to drop the column `firstname` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `name` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTime` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "guest" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
