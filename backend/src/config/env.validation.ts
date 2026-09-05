import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  MinLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  validateSync,
} from 'class-validator';

/**
 * Contrato ESTRICTO de variables de entorno.
 *
 * Reglas de este archivo:
 *  - Ninguna variable tiene valor por defecto ni fallback (`||`) en el codigo.
 *  - Si falta una variable, o conserva un valor de ejemplo, la aplicacion NO arranca.
 *  - Cualquier consumo posterior debe usar `configService.getOrThrow(...)`.
 */

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/** Valores tipicos de plantilla que jamas deben llegar a ejecucion. */
const PLACEHOLDER_PATTERN =
  /(cambiar|reemplaz|change[_-]?me|your[_-]|dummy|placeholder|todo|xxxx|<.+>)/i;

function IsNotPlaceholder(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isNotPlaceholder',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return (
            typeof value === 'string' &&
            value.trim().length > 0 &&
            !PLACEHOLDER_PATTERN.test(value)
          );
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} conserva un valor de ejemplo de .env.example; coloque el valor real.`;
        },
      },
    });
  };
}

const parseBoolean = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') {
    return value;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return value;
};

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment, {
    message: `NODE_ENV debe ser uno de: ${Object.values(NodeEnvironment).join(', ')}`,
  })
  NODE_ENV!: NodeEnvironment;

  @Type(() => Number)
  @IsInt({ message: 'PORT debe ser un numero entero' })
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  @IsNotPlaceholder()
  @Matches(/^postgres(ql)?:\/\/[^\s]+$/, {
    message: 'DATABASE_URL debe ser una cadena de conexion postgresql:// valida',
  })
  DATABASE_URL!: string;

  @Transform(parseBoolean)
  @IsBoolean({ message: 'DATABASE_SSL debe ser exactamente "true" o "false"' })
  DATABASE_SSL!: boolean;

  @IsString()
  @IsNotPlaceholder()
  @MinLength(32, {
    message: 'JWT_SECRET debe tener al menos 32 caracteres aleatorios',
  })
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(s|m|h|d)$/, {
    message: 'JWT_EXPIRES_IN debe tener formato de duracion, por ejemplo 7d, 12h o 3600s',
  })
  JWT_EXPIRES_IN!: string;

  @IsNotPlaceholder()
  @IsUrl(
    { require_tld: false, protocols: ['http', 'https'] },
    { message: 'FRONTEND_URL debe ser una URL http(s) valida' },
  )
  FRONTEND_URL!: string;

  @IsString()
  @IsNotEmpty()
  @IsNotPlaceholder()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  @IsNotPlaceholder()
  GOOGLE_CLIENT_SECRET!: string;

  @IsNotPlaceholder()
  @IsUrl(
    { require_tld: false, protocols: ['http', 'https'] },
    { message: 'GOOGLE_CALLBACK_URL debe ser una URL http(s) valida' },
  )
  GOOGLE_CALLBACK_URL!: string;
}

/**
 * Validador usado por `ConfigModule.forRoot({ validate })`.
 * Corta el arranque con un reporte completo en lugar de fallar mas tarde en runtime.
 */
export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    excludeExtraneousValues: false,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    forbidUnknownValues: false,
  });

  if (errors.length > 0) {
    const detail = errors
      .map((error) => {
        const reasons = Object.values(error.constraints ?? {}).join('; ');
        return `  - ${error.property}: ${reasons || 'valor requerido ausente'}`;
      })
      .join('\n');

    throw new Error(
      [
        'Configuracion de entorno invalida. El backend no puede iniciar.',
        detail,
        'Complete backend/.env tomando como plantilla backend/.env.example.',
      ].join('\n'),
    );
  }

  return validated;
}
