import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Initializes a cron job to clear expired sessions every hour if they are past their expiration date
 */
export const initializeClearSessionsCron = () => {
  const start = () => setInterval(() => {
    prisma.session.deleteMany({
      where: {
        expires: {
          lte: new Date()
        }
      }
    })
  }, 1000 * 60 * 60);

  start();
}