import faker from '@micra/faker/complete';
import {fn} from '@/spy';

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
  serialize = fn();
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
  hasAny = fn();
  has = fn();
  get = fn();
  set = fn();
};
