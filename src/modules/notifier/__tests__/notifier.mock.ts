import { createMock } from '@golevelup/ts-jest';
import { Notifier } from '@src/modules/notifier/notifier';

export const mockNotifierProvider = {
  provide: Notifier,
  useValue: createMock<Notifier>(),
};
