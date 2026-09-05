import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type DatabaseInstance = PostgresJsDatabase<typeof schema>;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly client: postgres.Sql;
  public readonly db: DatabaseInstance;

  constructor(private readonly configService: ConfigService) {
    const rawDatabaseUrl =
      this.configService.get<string>('DATABASE_URL') ||
      'postgresql://postgres:postgres@localhost:5432/recet_system';

    // Garantizar conexion forzada con SSL (sslmode=require) segun especificacion
    const databaseUrl = rawDatabaseUrl.includes('sslmode=')
      ? rawDatabaseUrl
      : `${rawDatabaseUrl}${rawDatabaseUrl.includes('?') ? '&' : '?'}sslmode=require`;

    this.client = postgres(databaseUrl, {
      ssl: databaseUrl.includes('localhost') ? false : 'require',
      max: 10,
    });

    this.db = drizzle(this.client, { schema });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.end();
  }
}
