import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '@src/common/decorators/is-public.decorator';
import { User } from '@src/common/decorators/user.decorator';
import { expiresInToDate } from '@src/lib/utils';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { AuthService } from '@src/modules/auth/auth.service';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserLoginEmailDto } from '@src/modules/user/dto/user-login-email.dto';
import * as jwtPayload from '@src/types/jwt-payload';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {}

  @Public()
  @Post('/register')
  async register(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(userDto);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('login/email')
  async signInWithEmail(
    @Body() user: UserLoginEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signInWithEmail(user);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('/refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const tokens = await this.authService.refresh(refreshToken);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: expiresInToDate(this.config.auth.JWT_REFRESH_EXPIRES_IN),
      secure: this.config.isProduction,
    });
  }

  @Post('/logout')
  async logout(
    @User() user: jwtPayload.JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);

    res.cookie('refreshToken', null, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      secure: this.config.isProduction,
    });

    return { message: 'Logout successful' };
  }
}
