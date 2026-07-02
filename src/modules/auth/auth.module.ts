import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CsrfService } from '@src/modules/auth/crsf.service';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService, CsrfService],
  exports: [CsrfService],
})
export class AuthModule {}
