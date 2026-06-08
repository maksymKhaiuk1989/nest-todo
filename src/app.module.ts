import { Module, ValidationPipe } from '@nestjs/common';
import { TasksModule } from '@modules/tasks/tasks.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from '@common/guards/auth.guard';
import { ConfigModule } from '@src/modules/config/config.module';

@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      port: Number(process.env.PORT) || 3000,
      dbHost: process.env.DB_HOST || 'localhost',
      apiKey: process.env.API_KEY || 'secret',
      appMode: process.env.APP_MODE || 'mobile',
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
