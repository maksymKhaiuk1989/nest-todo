import { Module, ValidationPipe } from '@nestjs/common';
import { TasksModule } from '@modules/tasks/tasks.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from '@common/guards/auth.guard';
import { AppConfigModule } from '@src/modules/app-config/app-config.module';
import { DbModule } from '@src/modules/db/type-orm.module';
import { UserModule } from '@src/modules/user/user.module';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

@Module({
  imports: [AppConfigModule, DbModule, UserModule, TasksModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: (config: AppConfigService) => {
        return new ValidationPipe({
          transform: true,
          enableDebugMessages: config.isDevelopment,
        });
      },
      inject: [AppConfigService],
    },
  ],
})
export class AppModule {}
