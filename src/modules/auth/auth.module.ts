import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.auth.JWT_SECRET,
        signOptions: {
          expiresIn: config.auth.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
