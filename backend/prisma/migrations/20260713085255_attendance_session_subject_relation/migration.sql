/*
  Warnings:

  - You are about to drop the column `attendanceDate` on the `AttendanceSession` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `AttendanceSession` table. All the data in the column will be lost.
  - You are about to drop the column `lectureNumber` on the `AttendanceSession` table. All the data in the column will be lost.
  - You are about to drop the column `room` on the `AttendanceSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AttendanceSession" DROP COLUMN "attendanceDate",
DROP COLUMN "expiresAt",
DROP COLUMN "lectureNumber",
DROP COLUMN "room",
ALTER COLUMN "endTime" DROP NOT NULL;
