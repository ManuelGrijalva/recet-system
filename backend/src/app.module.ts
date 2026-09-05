import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { InteractionsModule } from './modules/interactions/interactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      // Validacion estricta: si falta o es invalida una variable, el arranque falla.
      validate: validateEnvironment,
      cache: true,
      expandVariables: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RecipesModule,
    InteractionsModule,
  ],
})
export class AppModule {}
