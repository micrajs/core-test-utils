import faker from '@micra/faker/complete';
import {MockEventEmitter} from '@/event-emitter';
import {fn} from '@/spy';

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
};
