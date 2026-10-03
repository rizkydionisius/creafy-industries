import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const logos = await prisma.logo.findMany();
  console.log("Logos:", logos.slice(0, 3));
}
check();
