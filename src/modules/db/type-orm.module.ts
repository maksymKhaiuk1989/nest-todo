import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@src/modules/app-config/app-config.module';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { TaskEntity } from '@src/modules/tasks/entities/task.entity';
import { UserEntity } from '@src/modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        const { HOST, PORT, USER, PASS, NAME } = config.db;

        return {
          type: 'postgres',
          host: HOST,
          port: PORT,
          username: USER,
          password: PASS,
          database: NAME,
          entities: [UserEntity, TaskEntity],
          synchronize: config.isDevelopment,
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
