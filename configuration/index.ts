/* eslint-disable @typescript-eslint/no-empty-function */
import {fn} from '@/spy';
import type {Static} from '@micra/core/utilities/Static';
import {MockEventEmitter} from '@/event-emitter';

export const MockConfiguration = class MockConfiguration
  extends MockEventEmitter
  implements Micra.Configuration
{
  get = fn();
  has = fn();
  set = fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.Configuration
   * @returns Static Micra.Configuration
   */
  static with(partial: Micra.Configuration): Static<Micra.Configuration> {
    return class ExtendedMockConfiguration extends MockConfiguration {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
