import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  App_ErrorBadRequest,
  App_ErrorUnauthorized,
} from '@src/common/exceptions';
import { compareHash, expiresInToDate, generateHash } from '@src/lib/utils';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { UserRequestPayloadJWT } from '@src/modules/auth/types';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserLoginEmailDto } from '@src/modules/user/dto/user-login-email.dto';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { UserService } from '@src/modules/user/user.service';
import { CookieOptions } from 'express';
import type { Request, Response } from 'express';

@Injectable()
export class AuthService {
  private readonly jwtRefreshCookieOptions: CookieOptions;
  private readonly jwtRefreshCookieName = 'refreshToken';

  constructor(
    private config: AppConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.jwtRefreshCookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      expires: expiresInToDate(this.config.auth.JWT_REFRESH_EXPIRES_IN),
      secure: this.config.isProduction,
      path: '/',
    };
  }

  async register(data: CreateUserDto) {
    const user = await this.userService.create(data);

    return await this.generateTokensForUser(user);
  }

  async signInWithEmail(data: UserLoginEmailDto) {
    const { email, password } = data;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new App_ErrorBadRequest('Invalid email or password');
    }

    const isMatch = await compareHash(password, user.password);

    if (!isMatch) {
      throw new App_ErrorBadRequest('Invalid hash');
    }

    return await this.generateTokensForUser(user);
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<UserRequestPayloadJWT>(
      refreshToken,
      {
        secret: this.config.auth.JWT_REFRESH_SECRET,
      },
    );

    const userId = payload.sub;

    if (!userId || typeof userId !== 'string') {
      throw new App_ErrorUnauthorized('Invalid refresh token');
    }

    const user = await this.userService.findOneById(userId);

    if (!user?.hashedRefreshToken) {
      throw new App_ErrorUnauthorized('Login first');
    }

    const isTokenMatch = await compareHash(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isTokenMatch) {
      throw new App_ErrorUnauthorized('Invalid refresh token');
    }

    return await this.generateTokensForUser(user);
  }

  async logout(userId: string) {
    await this.userService.update(userId, {
      hashedRefreshToken: undefined,
    });
  }

  setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(this.jwtRefreshCookieName, token, this.jwtRefreshCookieOptions);
  }

  clearJwtRefreshCookie(res: Response) {
    res.clearCookie(this.jwtRefreshCookieName, this.jwtRefreshCookieOptions);
  }

  getRefreshTokenCookie(req: Request) {
    const token = req.cookies[this.jwtRefreshCookieName] as string | undefined;

    if (!token) {
      throw new App_ErrorUnauthorized('Refresh token not provided');
    }

    return token;
  }

  private async generateTokensForUser(user: UserEntity) {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.auth.JWT_ACCESS_SECRET,
        expiresIn: this.config.auth.JWT_ACCESS_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.auth.JWT_REFRESH_SECRET,
        expiresIn: this.config.auth.JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    const hashedRefreshToken = await generateHash(refreshToken);

    await this.userService.update(user.id, {
      hashedRefreshToken,
    });

    return { accessToken, refreshToken };
  }
}
