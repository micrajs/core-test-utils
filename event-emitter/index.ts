import {fn} from '@/spy';
import {Static} from '@micra/core/utilities/Static';

export const MockEventEmitter = class MockEventEmitter
  implements Micra.EventEmitter
{
  on = fn();
  emit = fn();
  emitSync = fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.EventEmitter
   * @returns Static Micra.EventEmitter
   */
  static with(partial: Micra.EventEmitter): Static<Micra.EventEmitter> {
    return class ExtendedMockEventEmitter extends MockEventEmitter {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
