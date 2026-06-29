import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginEmailDto } from '@src/modules/user/dto/user-login-email.dto';
import { UserService } from '@src/modules/user/user.service';
import { JwtPayload } from '@src/types/jwt-payload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signInWithEmail(data: UserLoginEmailDto) {
    const { email, password } = data;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.comparePassword(password, user.password);

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async comparePassword(password: string, hash: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
