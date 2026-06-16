import { Module } from '@nestjs/common';
import { TasksModule } from '@modules/tasks/tasks.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@common/guards/auth.guard';
import { AppConfigModule } from '@src/modules/app-config/app-config.module';
import { DbModule } from '@src/modules/db/type-orm.module';
import { UserModule } from '@src/modules/user/user.module';
import { ValidationModule } from '@src/modules/validation/validation.module';

@Module({
  imports: [
    // --- Core modules ---
    AppConfigModule,
    ValidationModule,
    DbModule,

    // --- Feature Modules ---
    UserModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
