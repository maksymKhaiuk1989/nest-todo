import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Public } from '@src/common/decorators/is-public.decorator';
import { User } from '@src/common/decorators/user.decorator';
import { AuthService } from '@src/modules/auth/auth.service';
import { CsrfService } from '@src/modules/auth/crsf.service';
import type { UserRequestPayloadJWT } from '@src/modules/auth/types';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserLoginEmailDto } from '@src/modules/user/dto/user-login-email.dto';

import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly csrfService: CsrfService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.authService.register(userDto);

    return user;
  }

  @Public()
  @Post('login/email')
  async signInWithEmail(
    @Body() user: UserLoginEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user: returnedUser, tokens } =
      await this.authService.signInWithEmail(user);

    this.authService.setRefreshTokenCookie(res, tokens.refreshToken);

    return { user: returnedUser, accessToken: tokens.accessToken };
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

  @Public()
  @Get('csrf')
  getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.csrfService.generateSessionId(req, res);
    const csrfToken = this.csrfService.generateCsrfToken(req, res);
    return { csrfToken };
  }

  @Post('logout')
  async logout(
    @User() user: UserRequestPayloadJWT,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);

    this.authService.clearJwtRefreshCookie(res);

    return { message: 'Logout successful' };
  }
}
