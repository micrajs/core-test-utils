import {vi} from 'vitest';
import {faker} from '@faker-js/faker';
import {factory} from 'node-factory';

export const ErrorMessageFactory = factory<Micra.ErrorMessage>((fake) => ({
  status: 500,
  title: fake.lorem.words(3),
}));

export const ValidationErrorExtrasFactory = factory<
  Micra.ValidationErrorExtras<string>
>((fake) => ({
  field: fake.lorem.word(3),
  message: fake.lorem.sentence(),
}));

export const MockError = class MockError implements Micra.Error {
  constructor() {
    Object.setPrototypeOf(this, MockError.prototype);
    // Implementation detail to get error guard working.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)['__MICRA_ERROR__'] = 'Micra.Error';
  }

  statusCode: number = faker.datatype.number();
  serialize = vi.fn();
  name: string = faker.lorem.words(3);
  message: string = faker.lorem.sentence();
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
