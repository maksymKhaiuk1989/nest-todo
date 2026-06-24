import { Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_CACHE_TTL } =
          config.cache;
        const url = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

        return {
          stores: new KeyvRedis(url),
          ttl: REDIS_CACHE_TTL,
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
