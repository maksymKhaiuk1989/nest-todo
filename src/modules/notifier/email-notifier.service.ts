import { Injectable } from '@nestjs/common';
import { Notifier } from './notifier';

@Injectable()
export class EmailNotifier implements Notifier {
  send(message: string) {
    console.log('[Email] Sending...:', message);
  }
}
