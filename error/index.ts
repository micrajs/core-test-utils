/// <reference types="@micra/core/error" />
import faker from '@micra/faker/complete';
import {fn} from '../spy';
import {Constructor} from '@micra/core/utilities/Constructor';

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
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.Error
   * @returns Constructor Micra.Error
   */
  static with(partial: Micra.Error): Constructor<Micra.Error> {
    return class ExtendedMockError extends MockError {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
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

  statusCode = 422 as const;
  hasAny = fn();
  has = fn();
  get = fn();
  set = fn();
};
