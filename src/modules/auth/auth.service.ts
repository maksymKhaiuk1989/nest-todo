import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHash, generateHash } from '@src/lib/utils';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserLoginEmailDto } from '@src/modules/user/dto/user-login-email.dto';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { UserService } from '@src/modules/user/user.service';
import { JwtPayload } from '@src/types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private config: AppConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto) {
    const user = await this.userService.create(data);

    return await this.generateTokensForUser(user);
  }

  async signInWithEmail(data: UserLoginEmailDto) {
    const { email, password } = data;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await compareHash(password, user.password);

    return await this.generateTokensForUser(user);
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      refreshToken,
      {
        secret: this.config.auth.JWT_REFRESH_SECRET,
      },
    );

    const userId = payload.sub;

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findOneById(userId);

    if (!user?.hashedRefreshToken) {
      throw new UnauthorizedException('Login first');
    }

    const isTokenMatch = await compareHash(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isTokenMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return await this.generateTokensForUser(user);
  }

  async logout(userId: string) {
    await this.userService.update(userId, {
      hashedRefreshToken: undefined,
    });
  }

  private async generateTokens(payload: JwtPayload) {
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

    return { accessToken, refreshToken };
  }

  private async generateTokensForUser(user: UserEntity) {
    const payload = { sub: user.id, email: user.email };

    const tokens = await this.generateTokens(payload);

    const hashedRefreshToken = await generateHash(tokens.refreshToken);

    await this.userService.update(user.id, {
      hashedRefreshToken,
    });

    return tokens;
  }
}
