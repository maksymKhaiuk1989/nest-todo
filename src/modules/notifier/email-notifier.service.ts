import { Injectable } from '@nestjs/common';
import { BaseNotifier } from '@src/modules/notifier/notifier.base';

@Injectable()
export class EmailNotifier extends BaseNotifier {
  performSend(message: string) {
    console.log('[Email] Sending...:', message);

    return true;
  }
}
