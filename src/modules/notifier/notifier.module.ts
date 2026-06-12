import { Module } from '@nestjs/common';
import { SmsNotifier } from './sms-notifier.service';
import { EmailNotifier } from './email-notifier.service';
import { Notifier } from '@src/modules/notifier/notifier';
import { ConfigService } from '@nestjs/config';
import {
  EnvironmentVariables,
  NodeEnv,
} from '@src/modules/app-config/env.validation';

const notifierProvider = {
  provide: Notifier,
  useFactory: (config: ConfigService<EnvironmentVariables, true>) => {
    const appConfig = config.get('app', { infer: true });

    if (appConfig.NODE_ENV === NodeEnv.PRODUCTION) {
      return new SmsNotifier();
    }

    return new EmailNotifier();
  },
  inject: [ConfigService],
};

@Module({
  providers: [notifierProvider],
  exports: [notifierProvider],
})
export class NotifierModule {}
