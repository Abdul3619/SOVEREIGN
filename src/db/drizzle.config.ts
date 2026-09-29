import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env file.
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

// Either DATABASE_URL, or the separate SQL_* settings, must be provided.
if (!databaseUrl) {
  if (!sqlHost) throw new Error('Set DATABASE_URL, or SQL_HOST, SQL_DB_NAME, SQL_ADMIN_USER and SQL_ADMIN_PASSWORD.');
  if (!sqlDbName) throw new Error('SQL_DB_NAME must be set in environment variables.');
  if (!user) throw new Error('SQL_ADMIN_USER must be set in environment variables.');
  if (!password) throw new Error('SQL_ADMIN_PASSWORD must be set in environment variables.');
  console.log(`Using admin user: ${user} to connect to database.`);
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle', // Output directory for migrations.
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: databaseUrl
    ? { url: databaseUrl }
    : { host: sqlHost!, user: user!, password: password!, database: sqlDbName!, ssl: false },
  verbose: true,
});
