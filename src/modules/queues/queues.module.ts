import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        connection: {
          host: config.cache.REDIS_HOST,
          port: config.cache.REDIS_PORT,
          password: config.cache.REDIS_PASSWORD,
        },
        prefix: 'bull_',
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
