import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { users } from '../../database/schema';
import { GoogleUserResult } from './strategies/google.strategy';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthUser(googleUser: GoogleUserResult): Promise<AuthenticatedUser> {
    const existing = await this.databaseService.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.email, googleUser.email))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const [newUser] = await this.databaseService.db
      .insert(users)
      .values({
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
        role: 'USER',
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
      });

    return newUser;
  }

  generateJwt(user: AuthenticatedUser): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
