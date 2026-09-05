import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface PostgresDatabaseError {
  code?: string;
  detail?: string;
  table_name?: string;
  constraint_name?: string;
  message?: string;
}

function isPostgresDatabaseError(err: unknown): err is PostgresDatabaseError {
  return typeof err === 'object' && err !== null && 'code' in err;
}

@Catch()
export class DrizzleExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (isPostgresDatabaseError(exception)) {
      // 23505: Unique violation (ej. reaccion duplicada o correo ya existente)
      if (exception.code === '23505') {
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'El registro ya existe o viola una restricción única.',
          detail: exception.detail,
        });
        return;
      }

      // 23503: Foreign key violation (ej. receta o usuario no existe)
      if (exception.code === '23503') {
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Referencia a entidad inexistente.',
          detail: exception.detail,
        });
        return;
      }
    }

    const message =
      exception instanceof Error ? exception.message : 'Error interno del servidor';

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message,
    });
  }
}
