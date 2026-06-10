import { runValidationTests } from '@src/modules/notifier/__tests__/notifier.helper';
import { SmsNotifier } from '@src/modules/notifier/sms-notifier.service';

describe('SmsNotifier', () => {
  let smsService: SmsNotifier;

  beforeEach(() => {
    smsService = new SmsNotifier();
    console.log = jest.fn();
  });

  runValidationTests(() => smsService);

  describe('send', () => {
    it('It should send sms', () => {
      const message = 'Hello world!!!';

      smsService.send(message);

      expect(console.log).toHaveBeenCalledWith('[SMS] Sending...:', message);
    });
  });
});
