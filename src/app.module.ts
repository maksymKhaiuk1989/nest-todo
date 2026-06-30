import { Module } from '@nestjs/common';
import { TasksModule } from '@modules/tasks/tasks.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppConfigModule } from '@src/modules/app-config/app-config.module';
import { DbModule } from '@src/modules/db/type-orm.module';
import { UserModule } from '@src/modules/user/user.module';
import { ValidationModule } from '@src/modules/validation/validation.module';
import { AppCacheModule } from '@src/modules/cache/app-cache.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QueuesModule } from '@src/modules/queues/queues.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { CustomExceptionFilter } from '@src/common/filters/custom-exception.filter';

@Module({
  imports: [
    // --- Core modules ---
    AppConfigModule,
    ValidationModule,
    DbModule,
    AppCacheModule,
    ScheduleModule.forRoot(),
    QueuesModule,

    // --- Feature Modules ---
    AuthModule,
    UserModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
