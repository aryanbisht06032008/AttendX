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
    // Keep the password in sync with DEFAULT_ADMIN_PASSWORD on every
    // re-seed, so the .env value always matches the stored hash.
    update: {
      password: hashedPassword,
    },
    create: {
      name: "System Administrator",
      email: "admin@attendx.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Admin created/updated");

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

  if (!cseDepartment || !itDepartment) {
    throw new Error("Departments not found.");
  }

  // ==========================================
  // Seed Programs
  // ==========================================

  const programs = [
    {
      name: "Bachelor of Technology - Computer Science & Engineering",
      code: "BTECH-CSE",
      departmentId: cseDepartment.id,
      duration: 4,
      semesters: 8,
    },
    {
      name: "Bachelor of Technology - Information Technology",
      code: "BTECH-IT",
      departmentId: itDepartment.id,
      duration: 4,
      semesters: 8,
    },
    {
      name: "Bachelor of Computer Applications",
      code: "BCA",
      departmentId: cseDepartment.id,
      duration: 3,
      semesters: 6,
    },
    {
      name: "Master of Computer Applications",
      code: "MCA",
      departmentId: cseDepartment.id,
      duration: 2,
      semesters: 4,
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