-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "teacherLatitude" DOUBLE PRECISION,
ADD COLUMN     "teacherLongitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "studentLatitude" DOUBLE PRECISION,
ADD COLUMN     "studentLongitude" DOUBLE PRECISION,
ADD COLUMN     "distanceMeters" DOUBLE PRECISION;
