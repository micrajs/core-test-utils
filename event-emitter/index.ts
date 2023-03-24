/// <reference types="@micra/core/event-emitter" />
import {fn} from '../spy';
import {Constructor} from '@micra/core/utilities/Constructor';

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
   * @returns Constructor Micra.EventEmitter
   */
  static with(partial: Micra.EventEmitter): Constructor<Micra.EventEmitter> {
    return class ExtendedMockEventEmitter extends MockEventEmitter {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
