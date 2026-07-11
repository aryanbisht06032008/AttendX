const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcrypt");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ==========================================
  // Create Default Admin
  // ==========================================

  const hashedPassword = await bcrypt.hash(
    process.env.DEFAULT_ADMIN_PASSWORD,
    10
  );

  await prisma.user.upsert({
    where: {
      email: "admin@attendx.com",
    },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@attendx.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Admin created");

  // ==========================================
  // Seed Departments
  // ==========================================

  const departments = [
    {
      name: "Computer Science & Engineering",
      code: "CSE",
    },
    {
      name: "Information Technology",
      code: "IT",
    },
    {
      name: "Electronics & Communication Engineering",
      code: "ECE",
    },
    {
      name: "Mechanical Engineering",
      code: "ME",
    },
    {
      name: "Civil Engineering",
      code: "CE",
    },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: {
        code: department.code,
      },
      update: {},
      create: department,
    });
  }

  console.log("✅ Departments seeded");

  // ==========================================
  // Seed Courses
  // ==========================================

  const courses = [
    {
      name: "Bachelor of Technology",
      code: "BTECH",
      durationYears: 4,
      totalSemesters: 8,
    },
    {
      name: "Bachelor of Computer Applications",
      code: "BCA",
      durationYears: 3,
      totalSemesters: 6,
    },
    {
      name: "Master of Computer Applications",
      code: "MCA",
      durationYears: 2,
      totalSemesters: 4,
    },
    {
      name: "Master of Technology",
      code: "MTECH",
      durationYears: 2,
      totalSemesters: 4,
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: {
        code: course.code,
      },
      update: {},
      create: course,
    });
  }

  console.log("✅ Courses seeded");

  // ==========================================
  // Fetch Departments & Courses
  // ==========================================

  const cseDepartment = await prisma.department.findUnique({
    where: { code: "CSE" },
  });

  const itDepartment = await prisma.department.findUnique({
    where: { code: "IT" },
  });

  const btechCourse = await prisma.course.findUnique({
    where: { code: "BTECH" },
  });

  const bcaCourse = await prisma.course.findUnique({
    where: { code: "BCA" },
  });

  const mcaCourse = await prisma.course.findUnique({
    where: { code: "MCA" },
  });

  if (
    !cseDepartment ||
    !itDepartment ||
    !btechCourse ||
    !bcaCourse ||
    !mcaCourse
  ) {
    throw new Error("Departments or Courses not found.");
  }

  // ==========================================
  // Seed Programs
  // ==========================================

  const programs = [
    {
      name: "Bachelor of Technology - Computer Science & Engineering",
      code: "BTECH-CSE",
      departmentId: cseDepartment.id,
      courseId: btechCourse.id,
      totalSeats: 120,
    },
    {
      name: "Bachelor of Technology - Information Technology",
      code: "BTECH-IT",
      departmentId: itDepartment.id,
      courseId: btechCourse.id,
      totalSeats: 60,
    },
    {
      name: "Bachelor of Computer Applications",
      code: "BCA",
      departmentId: cseDepartment.id,
      courseId: bcaCourse.id,
      totalSeats: 120,
    },
    {
      name: "Master of Computer Applications",
      code: "MCA",
      departmentId: cseDepartment.id,
      courseId: mcaCourse.id,
      totalSeats: 60,
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: {
        code: program.code,
      },
      update: {},
      create: program,
    });
  }

  console.log("✅ Programs seeded");

  console.log("🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });