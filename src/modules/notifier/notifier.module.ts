import { Module } from '@nestjs/common';
import { SmsNotifier } from './sms-notifier.service';
import { EmailNotifier } from './email-notifier.service';
import { Notifier } from '@src/modules/notifier/notifier';
import { ConfigService } from '@src/modules/config/config.service';

const notifierProvider = {
  provide: Notifier,
  useFactory: (config: ConfigService) => {
    if (config.get('appMode') === 'mobile') {
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
