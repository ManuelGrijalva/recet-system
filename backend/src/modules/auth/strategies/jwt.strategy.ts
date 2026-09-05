import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { DatabaseService } from '../../../database/database.service';
import { eq } from 'drizzle-orm';
import { users } from '../../../database/schema';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN';
}

const cookieOrHeaderExtractor = (req: Request): string | null => {
  if (req && req.cookies && typeof req.cookies['jwt'] === 'string') {
    return req.cookies['jwt'];
  }
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'recet_system_jwt_secret_production_2026',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado o sesión inválida');
    }

    return user;
  }
}
