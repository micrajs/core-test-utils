/// <reference types="@micra/core/environment" />
import faker from '@micra/faker/complete';
import {MockEventEmitter} from '../event-emitter';
import {fn} from '../spy';
import type {Constructor} from '@micra/core/utilities/Constructor';

export const EnvironmentSetEventFactory = faker.factory<
  Micra.EnvironmentEvents['set']
>(
  (fake) =>
    ({
      key: fake.alpha(),
      value: fake.uuid(),
    } as Micra.EnvironmentEvents['set']),
);

export const MockEnvironment = class MockEnvironment
  extends MockEventEmitter
  implements Micra.Environment
{
  all = fn();
  get = fn();
  has = fn();
  init = fn();
  initSync = fn();
  validate = fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.Environment
   * @returns Constructor Micra.Environment
   */
  static with(partial: Micra.Environment): Constructor<Micra.Environment> {
    return class ExtendedMockEnvironment extends MockEnvironment {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
