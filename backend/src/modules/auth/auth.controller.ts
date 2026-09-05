import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
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

class DevLoginDto {
  email!: string;
  name!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    // Cookie segura HTTP-Only
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    res.redirect('http://localhost:3000/');
  }

  @Post('dev-login')
  async devLogin(
    @Body() body: DevLoginDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.authService.validateOAuthUser({
      email: body.email || 'dev@recetariojutiapa.gt',
      name: body.name || 'Manuel Grijalva (Desarrollo)',
      googleId: 'dev-12345',
    });

    const token = this.authService.generateJwt(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    res.clearCookie('jwt');
    res.json({ message: 'Sesión cerrada exitosamente' });
  }
}
