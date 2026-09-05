import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type DatabaseInstance = PostgresJsDatabase<typeof schema>;

/** Tamano maximo del pool de conexiones (constante de aplicacion, no configuracion de entorno). */
const CONNECTION_POOL_MAX = 10;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly client: postgres.Sql;
  public readonly db: DatabaseInstance;

  constructor(private readonly configService: ConfigService) {
    // Sin valores por defecto: la conexion proviene exclusivamente del entorno validado.
    const databaseUrl = this.configService.getOrThrow<string>('DATABASE_URL');
    const useSsl = this.configService.getOrThrow<boolean>('DATABASE_SSL');

    this.client = postgres(databaseUrl, {
      ssl: useSsl ? 'require' : false,
      max: CONNECTION_POOL_MAX,
    });

    this.db = drizzle(this.client, { schema });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.end();
  }
}
