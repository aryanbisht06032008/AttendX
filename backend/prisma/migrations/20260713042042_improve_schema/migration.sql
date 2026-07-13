/*
  Warnings:

  - You are about to drop the column `isTheory` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[programId,batchYear,name]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programId,semesterNumber]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sectionId,rollNumber]` on the table `StudentProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attendanceDate` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('THEORY', 'PRACTICAL', 'LAB');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "attendanceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lectureNumber" INTEGER,
ADD COLUMN     "room" TEXT;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "isTheory",
ADD COLUMN     "type" "SubjectType" NOT NULL;

-- AlterTable
ALTER TABLE "TeacherProfile" ADD COLUMN     "photoUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Section_programId_batchYear_name_key" ON "Section"("programId", "batchYear", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_programId_semesterNumber_key" ON "Semester"("programId", "semesterNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_sectionId_rollNumber_key" ON "StudentProfile"("sectionId", "rollNumber");
