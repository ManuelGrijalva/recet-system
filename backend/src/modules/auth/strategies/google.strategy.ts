import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

export interface GoogleUserResult {
  email: string;
  name: string;
  avatarUrl?: string;
  googleId: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { displayName, emails, photos, id } = profile;
    const email = emails && emails[0] ? emails[0].value : '';
    const avatarUrl = photos && photos[0] ? photos[0].value : undefined;

    const user: GoogleUserResult = {
      googleId: id,
      email,
      name: displayName || 'Usuario de Jutiapa',
      avatarUrl,
    };

    done(null, user);
  }
}
