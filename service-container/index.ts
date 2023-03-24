/* eslint-disable @typescript-eslint/no-empty-function */
import type {Constructor} from '@micra/core/utilities/Constructor';
import {fn} from '../spy';
import {MockEventEmitter} from '../event-emitter';

export const MockServiceContainer = class MockServiceContainer
  extends MockEventEmitter
  implements Micra.ServiceContainer
{
  register = fn();
  singleton = fn();
  factory = fn();
  value = fn();
  use = fn();
  has = fn();
  clone = fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.ServiceContainer
   * @returns Constructor Micra.ServiceContainer
   */
  static with(
    partial: Micra.ServiceContainer,
  ): Constructor<Micra.ServiceContainer> {
    return class ExtendedMockServiceContainer extends MockServiceContainer {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
