import {factory} from 'node-factory';
import {vi} from 'vitest';
import {MockEventEmitter} from '../event-emitter';

export const EnvironmentSetEventFactory = factory<
  Micra.EnvironmentEvents['set']
>(
  (fake) =>
    ({
      key: fake.lorem.word(),
      value: fake.lorem.sentence(),
    } as Micra.EnvironmentEvents['set']),
);

export const MockEnvironment = class MockEnvironment
  extends MockEventEmitter
  implements Micra.Environment
{
  all = vi.fn();
  get = vi.fn();
  has = vi.fn();
  init = vi.fn();
  initSync = vi.fn();
  validate = vi.fn();
};
