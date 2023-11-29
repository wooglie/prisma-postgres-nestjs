import { exec } from 'node:child_process';
/**
 * @TODO: re-write this when Prisma.io gets a programmatic migration API
 * https://github.com/prisma/prisma/issues/4703#issuecomment-1447354363
 */
export async function runDatabaseMigration() {
  return new Promise((resolve, reject) => {
    exec(
      'npx prisma migrate deploy --schema=./src/core/database/schema.prisma',
      (error) => {
        if (error) {
          console.error({
            requestId: undefined,
            context: 'DatabaseMigration',
            environment: process.env.ENVIRONMENT,
            message: 'Something went wrong while migrating the database',
            level: 'info',
            timestamp: new Date().toISOString(),
            error: error.message,
          });
          reject(error);
        } else {
          console.info({
            requestId: undefined,
            context: 'DatabaseMigration',
            environment: process.env.ENVIRONMENT,
            message: 'Ran a successful Prisma migration',
            level: 'info',
            timestamp: new Date().toISOString(),
          });
          resolve(true);
        }
      },
    );
  });
}
