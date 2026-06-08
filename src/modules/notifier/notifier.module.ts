import { Module } from '@nestjs/common';
import { SmsNotifier } from './sms-notifier.service';
import { EmailNotifier } from './email-notifier.service';

const notifierProvider = {
  provide: 'NOTIFIER',
  useFactory: () => {
    if (process.env.APP_MODE === 'mobile') {
      return new SmsNotifier();
    }
    return new EmailNotifier();
  },
};

@Module({
  providers: [notifierProvider],
  exports: [notifierProvider],
})
export class NotifierModule {}
