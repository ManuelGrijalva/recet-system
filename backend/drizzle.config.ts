import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/recet_system?sslmode=require',
  },
  verbose: true,
  strict: true,
});
