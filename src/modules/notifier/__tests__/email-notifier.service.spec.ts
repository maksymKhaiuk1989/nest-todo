import { EmailNotifier } from '@src/modules/notifier/email-notifier.service';
import { runValidationTests } from '@src/modules/notifier/__tests__/notifier.helper';

describe('EmailNotifier', () => {
  let emailService: EmailNotifier;

  beforeEach(() => {
    emailService = new EmailNotifier();
    console.log = jest.fn();
  });

  runValidationTests(() => emailService);

  describe('send', () => {
    it('should send email', () => {
      const message = 'Test message';

      emailService.performSend(message);

      expect(console.log).toHaveBeenCalledWith('[Email] Sending...:', message);
    });
  });
});
