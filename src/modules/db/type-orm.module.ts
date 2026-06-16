import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@src/modules/app-config/app-config.module';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { NodeEnv } from '@src/modules/app-config/env.validation';
import { TaskEntity } from '@src/modules/tasks/entities/task.entity';
import { UserEntity } from '@src/modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const { HOST, PORT, USER, PASS, NAME } = configService.db;
        const synchronize = configService.app.NODE_ENV !== NodeEnv.PRODUCTION;

        return {
          type: 'postgres',
          host: HOST,
          port: PORT,
          username: USER,
          password: PASS,
          database: NAME,
          entities: [UserEntity, TaskEntity],
          synchronize,
          retryAttempts: 5,
          retryDelay: 3000,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
