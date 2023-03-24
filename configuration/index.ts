/* eslint-disable @typescript-eslint/no-empty-function */
/// <reference types="@micra/core/configuration" />
import {fn} from '../spy';
import type {Constructor} from '@micra/core/utilities/Constructor';
import {MockEventEmitter} from '../event-emitter';

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
   * @returns Constructor Micra.Configuration
   */
  static with(partial: Micra.Configuration): Constructor<Micra.Configuration> {
    return class ExtendedMockConfiguration extends MockConfiguration {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
