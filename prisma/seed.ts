import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Пароль для всех тестовых аккаунтов: test123
  const password = await hash("test123", 12)

  // 1. Тестовый пациент
  const patient = await prisma.user.upsert({
    where: { email: "patient@test.com" },
    update: {},
    create: {
      email: "patient@test.com",
      name: "Тест Пациент",
      password,
      role: "PATIENT",
      patient: {
        create: {
          gender: "MALE",
          bloodType: "A+",
        },
      },
    },
  })
  console.log("✅ Created patient:", patient.email)

  // 2. Тестовый врач
  const doctor = await prisma.user.upsert({
    where: { email: "doctor@test.com" },
    update: {},
    create: {
      email: "doctor@test.com",
      name: "Доктор Тестов",
      password,
      role: "DOCTOR",
      doctor: {
        create: {
          specialization: "Невролог",
          hospital: "Aman AI Clinic",
        },
      },
    },
  })
  console.log("✅ Created doctor:", doctor.email)

  // 3. Тестовый админ
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Администратор",
      password,
      role: "ADMIN",
    },
  })
  console.log("✅ Created admin:", admin.email)

  console.log("")
  console.log("🎉 Seeding complete!")
  console.log("")
  console.log("📋 Test accounts (password: test123):")
  console.log("   - patient@test.com  (Пациент)")
  console.log("   - doctor@test.com   (Врач)")
  console.log("   - admin@test.com    (Админ)")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


