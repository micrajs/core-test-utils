/* eslint-disable @typescript-eslint/no-empty-function */
import type {Static} from '@micra/core/utilities/Static';
import {fn} from '@/spy';

export const MockServiceProvider = class MockServiceProvider
  implements Micra.ServiceProvider
{
  register = fn();
  boot = fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.ServiceProvider
   * @returns Static Micra.ServiceProvider
   */
  static with(partial: Micra.ServiceProvider): Static<Micra.ServiceProvider> {
    return class ExtendedMockServiceProvider extends MockServiceProvider {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};

export const MockAsyncServiceProvider = class MockAsyncServiceProvider
  implements Micra.ServiceProvider
{
  register = fn(async () => {});
  boot = fn(async () => {});
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.ServiceProvider
   * @returns Static Micra.ServiceProvider
   */
  static with(partial: Micra.ServiceProvider): Static<Micra.ServiceProvider> {
    return class ExtendedMockAsyncServiceProvider extends MockAsyncServiceProvider {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
