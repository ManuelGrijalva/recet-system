import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { NodeEnvironment } from '../../config/env.validation';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

interface RequestWithGoogleUser extends Request {
  user: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId: string;
  };
}

/** Vigencia de la cookie de sesion: 7 dias (constante de aplicacion, no de entorno). */
const SESSION_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

class DevLoginDto {
  @IsEmail({}, { message: 'email es obligatorio y debe ser un correo valido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'name es obligatorio' })
  @MaxLength(120)
  name!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {
    // Redirige al flujo de autenticacion de Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: RequestWithGoogleUser,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.authService.validateOAuthUser(req.user);
    const token = this.authService.generateJwt(user);

    res.cookie('jwt', token, this.buildSessionCookieOptions());
    res.redirect(this.configService.getOrThrow<string>('FRONTEND_URL'));
  }

  /**
   * Acceso de desarrollo. Bloqueado fuera de NODE_ENV=development y sin identidad
   * incrustada en el codigo: el correo y el nombre son obligatorios en el cuerpo.
   */
  @Post('dev-login')
  async devLogin(
    @Body() body: DevLoginDto,
    @Res() res: Response,
  ): Promise<void> {
    if (
      this.configService.getOrThrow<NodeEnvironment>('NODE_ENV') !==
      NodeEnvironment.Development
    ) {
      throw new ForbiddenException(
        'El acceso de desarrollo solo esta disponible con NODE_ENV=development',
      );
    }

    const user = await this.authService.validateOAuthUser({
      email: body.email,
      name: body.name,
      googleId: `dev:${body.email}`,
    });

    const token = this.authService.generateJwt(user);

    res.cookie('jwt', token, this.buildSessionCookieOptions());

    res.json({
      success: true,
      user,
      token,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Post('logout')
  logout(@Res() res: Response): void {
    res.clearCookie('jwt', this.buildCookieBaseOptions());
    res.json({ message: 'Sesión cerrada exitosamente' });
  }

  /** Atributos comunes de la cookie de sesion; `secure` sale del entorno validado. */
  private buildCookieBaseOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<NodeEnvironment>('NODE_ENV') ===
        NodeEnvironment.Production,
      sameSite: 'lax',
      path: '/',
    };
  }

  private buildSessionCookieOptions(): CookieOptions {
    return { ...this.buildCookieBaseOptions(), maxAge: SESSION_COOKIE_MAX_AGE_MS };
  }
}
