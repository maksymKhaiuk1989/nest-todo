import { Notifier } from '@src/modules/notifier/notifier';

export abstract class BaseNotifier extends Notifier {
  protected validateBeforeSend(message: string): boolean {
    if (!message || message.trim() === '') {
      return false;
    }

    return true;
  }

  send(message: string): boolean {
    if (!this.validateBeforeSend(message)) {
      return false;
    }

    return this.performSend(message);
  }

  abstract performSend(message: string): boolean;
}
