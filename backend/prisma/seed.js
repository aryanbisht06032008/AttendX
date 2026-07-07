const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcrypt");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // =========================
  // Create Default Admin
  // =========================

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

  // =========================
  // Seed Departments
  // =========================

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
}

main()
  .then(async () => {
    console.log("✅ Seed completed.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });