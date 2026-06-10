import { Notifier } from '@src/modules/notifier/notifier';

export function runValidationTests(createService: () => Notifier) {
  describe('Shared Validation Logic', () => {
    let service: Notifier;

    beforeEach(() => {
      service = createService();
      console.log = jest.fn();
    });

    it('should not send if message is empty', () => {
      expect(service.send('')).toBe(false);
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should not send if message contains only spaces', () => {
      expect(service.send('   ')).toBe(false);
      expect(console.log).not.toHaveBeenCalled();
    });
  });
}
