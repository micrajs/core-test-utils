import {vi} from 'vitest';
import faker from '@micra/faker/complete';

export const ErrorMessageFactory = faker.factory<Micra.ErrorMessage>(
  (fake) => ({
    status: 500,
    title: fake.uuid(),
  }),
);

export const ValidationErrorExtrasFactory = faker.factory<
  Micra.ValidationErrorExtras<string>
>((fake) => ({
  field: fake.string(),
  message: fake.uuid(),
}));

export const MockError = class MockError implements Micra.Error {
  constructor() {
    Object.setPrototypeOf(this, MockError.prototype);
    // Implementation detail to get error guard working.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)['__MICRA_ERROR__'] = 'Micra.Error';
  }

  statusCode: number = faker.number();
  serialize = vi.fn();
  name: string = faker.uuid();
  message: string = faker.uuid();
  stack?: string | undefined = undefined;
};

export const MockValidationError = class MockValidationError<
    Fields extends string = string,
  >
  extends MockError
  implements Micra.ValidationError<Fields>
{
  constructor() {
    super();
    Object.setPrototypeOf(this, MockValidationError.prototype);
  }

  statusCode: 422 = 422;
  hasAny = vi.fn();
  has = vi.fn();
  get = vi.fn();
  set = vi.fn();
};
