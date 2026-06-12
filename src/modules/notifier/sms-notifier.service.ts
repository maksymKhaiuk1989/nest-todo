import { Injectable } from '@nestjs/common';
import { BaseNotifier } from '@src/modules/notifier/notifier.base';

@Injectable()
export class SmsNotifier extends BaseNotifier {
  performSend(message: string) {
    console.log('[SMS] Sending...:', message);
    return true;
  }
}
