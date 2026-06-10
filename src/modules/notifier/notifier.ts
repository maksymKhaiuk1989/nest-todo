export abstract class Notifier {
  protected abstract validateBeforeSend(message: string): boolean;
  abstract send(message: string): boolean;
}
