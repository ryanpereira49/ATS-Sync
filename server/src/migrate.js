import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  const migrationsPath = path.join(__dirname, '../drizzle');
  console.log('Starting migrations...');
  await migrate(db, { migrationsFolder: migrationsPath });
  console.log('Migrations complete!');
  
  await pool.end();
};

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});