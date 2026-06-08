import { Injectable } from '@nestjs/common';
import { Notifier } from './notifier';

@Injectable()
export class SmsNotifier implements Notifier {
  send(message: string) {
    console.log('[SMS] Sending...:', message);
  }
}
