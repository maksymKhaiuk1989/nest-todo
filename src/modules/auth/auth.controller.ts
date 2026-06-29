import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@src/common/decorators/is-public.decorator';
import { AuthService } from '@src/modules/auth/auth.service';
import { UserLoginEmailDto } from '@src/modules/user/dto/user-login-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login/email')
  async signInWithEmail(@Body() user: UserLoginEmailDto) {
    return await this.authService.signInWithEmail(user);
  }
}
