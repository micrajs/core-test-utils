/* eslint-disable @typescript-eslint/no-empty-function */
import type {Static} from '@micra/core/utilities/Static';
import {fn} from '@/spy';
import {MockEventEmitter} from '@/event-emitter';

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
   * @returns Static Micra.ServiceContainer
   */
  static with(partial: Micra.ServiceContainer): Static<Micra.ServiceContainer> {
    return class ExtendedMockServiceContainer extends MockServiceContainer {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
