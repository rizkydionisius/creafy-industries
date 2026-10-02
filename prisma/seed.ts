/**
 * Script untuk membuat admin user pertama di PostgreSQL.
 * Jalankan: npx ts-node prisma/seed.ts
 * atau: npx prisma db seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@creafy.id';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = 'Admin Creafy';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin user sudah ada: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  console.log(`✅ Admin user berhasil dibuat:`);
  console.log(`   Email   : ${user.email}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Segera ganti password setelah login pertama!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
