import { config as loadEnvFile } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit corre fuera del contenedor de Nest, por lo que carga el .env por su cuenta.
loadEnvFile({ path: '.env.local' });
loadEnvFile({ path: '.env' });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `Falta la variable de entorno obligatoria ${name}. ` +
        'Complete backend/.env usando backend/.env.example antes de ejecutar las migraciones.',
    );
  }
  return value;
}

export default defineConfig({
  schema: './src/database/schema/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: requireEnv('DATABASE_URL'),
    ssl: requireEnv('DATABASE_SSL') === 'true' ? 'require' : false,
  },
  verbose: true,
  strict: true,
});
