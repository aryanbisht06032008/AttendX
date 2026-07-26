/*
  Warnings:

  - You are about to drop the column `courseId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `totalSeats` on the `Program` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_courseId_fkey";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "courseId",
DROP COLUMN "totalSeats",
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "semesters" INTEGER NOT NULL DEFAULT 8;

-- CreateTable
CREATE TABLE "_CourseToProgram" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToProgram_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToProgram_B_index" ON "_CourseToProgram"("B");

-- AddForeignKey
ALTER TABLE "_CourseToProgram" ADD CONSTRAINT "_CourseToProgram_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProgram" ADD CONSTRAINT "_CourseToProgram_B_fkey" FOREIGN KEY ("B") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
