import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seed database...\n");

  // 1. Initial System Settings
  const defaultSettings = [
    {
      settingKey: "MAX_ACTIVE_LOANS",
      value: "2",
      description: "Maksimal jumlah buku aktif yang dapat dipinjam siswa",
    },
    {
      settingKey: "DEFAULT_LOAN_DAYS",
      value: "7",
      description: "Durasi default peminjaman dalam hari",
    },
    {
      settingKey: "MAX_LOAN_EXTENSIONS",
      value: "1",
      description: "Maksimal jumlah perpanjangan per buku",
    },
    {
      settingKey: "DEFAULT_EXTENSION_DAYS",
      value: "7",
      description: "Durasi default perpanjangan dalam hari",
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { settingKey: setting.settingKey },
      update: {},
      create: setting,
    });
  }
  console.log("System Settings default created.");

  // 2. Data Pengguna (2 Role: ADMIN & PETUGAS)
  // - ADMIN = Admin / Kepala Perpustakaan (Akses penuh & supervisi)
  // - PETUGAS = Petugas Perpustakaan (Operasional sirkulasi & katalog)
  const defaultUsers: Array<{
    username: string;
    fullName: string;
    passwordPlain: string;
    role: UserRole;
    roleDescription: string;
  }> = [
    {
      username: "admin",
      fullName: "Drs. H. Ahmad Dahlan, M.Pd",
      passwordPlain: "admin123",
      role: "ADMIN",
      roleDescription: "Admin / Kepala Perpustakaan",
    },
    {
      username: "petugas",
      fullName: "Ustadzah Siti Rahmawati, S.Pd",
      passwordPlain: "petugas123",
      role: "PETUGAS",
      roleDescription: "Petugas Perpustakaan",
    },
  ];

  console.log("\n Create 2 users with 2 Role:");

  for (const user of defaultUsers) {
    const passwordHash = await bcrypt.hash(user.passwordPlain, 10);

    const createdOrUpdatedUser = await prisma.user.upsert({
      where: { username: user.username },
      update: {
        fullName: user.fullName,
        role: user.role,
        status: "ACTIVE",
      },
      create: {
        username: user.username,
        passwordHash,
        fullName: user.fullName,
        role: user.role,
        status: "ACTIVE",
      },
    });

    console.log(
      `   ✔ [${createdOrUpdatedUser.role}] ${createdOrUpdatedUser.fullName} (${user.roleDescription})`
    );
    console.log(`     Username : ${createdOrUpdatedUser.username}`);
    console.log(`     Password : ${user.passwordPlain}\n`);
  }

  console.log("Seeding process completed!");
}

main()
  .catch((e) => {
    console.error("Error on seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
