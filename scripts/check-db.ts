import { prisma } from '../lib/prisma';

(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('ok');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
