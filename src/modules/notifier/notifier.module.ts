import { Module } from '@nestjs/common';
import { SmsNotifier } from './sms-notifier.service';
import { EmailNotifier } from './email-notifier.service';
import { Notifier } from '@src/modules/notifier/notifier';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

const notifierProvider = {
  provide: Notifier,
  useFactory: (config: AppConfigService) => {
    if (config.isProduction) {
      return new SmsNotifier();
    }

    return new EmailNotifier();
  },
  inject: [AppConfigService],
};

@Module({
  providers: [notifierProvider],
  exports: [notifierProvider],
})
export class NotifierModule {}
