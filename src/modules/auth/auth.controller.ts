import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Public } from '@src/common/decorators/is-public.decorator';
import { User } from '@src/common/decorators/user.decorator';
import { AuthService } from '@src/modules/auth/auth.service';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserLoginEmailDto } from '@src/modules/user/dto/user-login-email.dto';
import * as jwtPayload from '@src/types/jwt-payload';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(userDto);

    this.authService.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('login/email')
  async signInWithEmail(
    @Body() user: UserLoginEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signInWithEmail(user);

    this.authService.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = this.authService.getRefreshTokenCookie(req);

    const tokens = await this.authService.refresh(refreshToken);

    this.authService.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  async logout(
    @User() user: jwtPayload.JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);

    this.authService.clearRefreshTokenCookie(res);

    return { message: 'Logout successful' };
  }
}
