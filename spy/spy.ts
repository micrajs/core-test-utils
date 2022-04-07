/**
 * This is a port from vitest spy functions. Originally these functions were imported from the framework but it caused an error when imported in the vitest environment.
 * For now, the implementation was copied and should be updated if the framework limitation is removed.
 *
 * https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/integrations/spy.ts
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {SpyImpl} from 'tinyspy';
import * as tinyspy from 'tinyspy';

interface MockResultReturn<T> {
  type: 'return';
  value: T;
}
interface MockResultIncomplete {
  type: 'incomplete';
  value: undefined;
}
interface MockResultThrow {
  type: 'throw';
  value: any;
}

type MockResult<T> =
  | MockResultReturn<T>
  | MockResultThrow
  | MockResultIncomplete;

export interface SpyContext<TArgs, TReturns> {
  calls: TArgs[];
  instances: TReturns[];
  invocationCallOrder: number[];
  results: MockResult<TReturns>[];
  lastCall: TArgs | undefined;
}

type Procedure = (...args: any[]) => any;

type Methods<T> = {
  [K in keyof T]: T[K] extends Procedure ? K : never;
}[keyof T] &
  string;
type Properties<T> = {
  [K in keyof T]: T[K] extends Procedure ? never : K;
}[keyof T] &
  string;
type Classes<T> = {
  [K in keyof T]: T[K] extends new (...args: any[]) => any ? K : never;
}[keyof T] &
  string;

export interface SpyInstance<TArgs extends any[] = any[], TReturns = any> {
  getMockName(): string;
  mockName(n: string): this;
  mock: SpyContext<TArgs, TReturns>;
  mockClear(): this;
  mockReset(): this;
  mockRestore(): void;
  getMockImplementation(): ((...args: TArgs) => TReturns) | undefined;
  mockImplementation(
    fn: ((...args: TArgs) => TReturns) | (() => Promise<TReturns>),
  ): this;
  mockImplementationOnce(
    fn: ((...args: TArgs) => TReturns) | (() => Promise<TReturns>),
  ): this;
  mockReturnThis(): this;
  mockReturnValue(obj: TReturns): this;
  mockReturnValueOnce(obj: TReturns): this;
  mockResolvedValue(obj: Awaited<TReturns>): this;
  mockResolvedValueOnce(obj: Awaited<TReturns>): this;
  mockRejectedValue(obj: any): this;
  mockRejectedValueOnce(obj: any): this;
}

export interface SpyInstanceFn<TArgs extends any[] = any, TReturns = any>
  extends SpyInstance<TArgs, TReturns> {
  (...args: TArgs): TReturns;
  new (...args: TArgs): TReturns;
}

export type MaybeMockedConstructor<T> = T extends new (
  ...args: Array<any>
) => infer R
  ? SpyInstanceFn<ConstructorParameters<T>, R>
  : T;
export type MockedFunction<T extends Procedure> = MockWithArgs<T> & {
  [K in keyof T]: T[K];
};
export type MockedFunctionDeep<T extends Procedure> = MockWithArgs<T> &
  MockedObjectDeep<T>;
export type MockedObject<T> = MaybeMockedConstructor<T> & {
  [K in Methods<T>]: T[K] extends Procedure ? MockedFunction<T[K]> : T[K];
} & {[K in Properties<T>]: T[K]};
export type MockedObjectDeep<T> = MaybeMockedConstructor<T> & {
  [K in Methods<T>]: T[K] extends Procedure ? MockedFunctionDeep<T[K]> : T[K];
} & {[K in Properties<T>]: MaybeMockedDeep<T[K]>};

export type MaybeMockedDeep<T> = T extends Procedure
  ? MockedFunctionDeep<T>
  : T extends object
  ? MockedObjectDeep<T>
  : T;

export type MaybeMocked<T> = T extends Procedure
  ? MockedFunction<T>
  : T extends object
  ? MockedObject<T>
  : T;

export type EnhancedSpy<
  TArgs extends any[] = any[],
  TReturns = any,
> = SpyInstance<TArgs, TReturns> & SpyImpl<TArgs, TReturns>;

export interface MockWithArgs<T extends Procedure>
  extends SpyInstanceFn<Parameters<T>, ReturnType<T>> {
  new (
    ...args: T extends new (...args: any) => any
      ? ConstructorParameters<T>
      : never
  ): T;
  (...args: Parameters<T>): ReturnType<T>;
}

export const spies = new Set<SpyInstance>();

export function isMockFunction(fn: any): fn is EnhancedSpy {
  return (
    typeof fn === 'function' && '_isMockFunction' in fn && fn._isMockFunction
  );
}

export function spyOn<T, S extends Properties<Required<T>>>(
  obj: T,
  methodName: S,
  accessType: 'get',
): SpyInstance<[], T[S]>;
export function spyOn<T, G extends Properties<Required<T>>>(
  obj: T,
  methodName: G,
  accessType: 'set',
): SpyInstance<[T[G]], void>;
export function spyOn<T, M extends Methods<Required<T>> | Classes<Required<T>>>(
  obj: T,
  methodName: M,
): Required<T>[M] extends (
  ...args: infer A
) => infer R | (new (...args: infer A) => infer R)
  ? SpyInstance<A, R>
  : never;
export function spyOn<T, K extends keyof T>(
  obj: T,
  method: K,
  accessType?: 'get' | 'set',
): SpyInstance {
  const dictionary = {
    get: 'getter',
    set: 'setter',
  } as const;
  const objMethod = accessType ? {[dictionary[accessType]]: method} : method;

  const stub = tinyspy.spyOn(obj, objMethod as any);

  return enhanceSpy(stub) as SpyInstance;
}

let callOrder = 0;

function enhanceSpy<TArgs extends any[], TReturns>(
  spy: SpyImpl<TArgs, TReturns>,
): SpyInstance<TArgs, TReturns> {
  const stub = spy as unknown as EnhancedSpy<TArgs, TReturns>;

  let implementation: ((...args: TArgs) => TReturns) | undefined;

  let instances: any[] = [];
  let invocations: number[] = [];

  const mockContext = {
    get calls() {
      return stub.calls;
    },
    get instances() {
      return instances;
    },
    get invocationCallOrder() {
      return invocations;
    },
    get results() {
      return stub.results.map(([callType, value]) => {
        const type = callType === 'error' ? 'throw' : 'return';
        return {type, value};
      });
    },
    get lastCall() {
      return stub.calls.at(-1);
    },
  };

  let onceImplementations: ((...args: TArgs) => TReturns)[] = [];

  let name: string = (stub as any).name;

  stub.getMockName = () => name || 'vi.fn()';
  stub.mockName = (n) => {
    name = n;
    return stub;
  };

  stub.mockClear = () => {
    stub.reset();
    instances = [];
    invocations = [];
    return stub;
  };

  stub.mockReset = () => {
    stub.mockClear();
    implementation = () => undefined as unknown as TReturns;
    onceImplementations = [];
    return stub;
  };

  stub.mockRestore = () => {
    stub.mockReset();
    implementation = undefined;
    return stub;
  };

  stub.getMockImplementation = () => implementation;
  stub.mockImplementation = (fn: (...args: TArgs) => TReturns) => {
    implementation = fn;
    return stub;
  };

  stub.mockImplementationOnce = (fn: (...args: TArgs) => TReturns) => {
    onceImplementations.push(fn);
    return stub;
  };

  stub.mockReturnThis = () =>
    stub.mockImplementation(function (this: TReturns) {
      return this;
    });

  stub.mockReturnValue = (val: TReturns) => stub.mockImplementation(() => val);
  stub.mockReturnValueOnce = (val: TReturns) =>
    stub.mockImplementationOnce(() => val);

  stub.mockResolvedValue = (val: Awaited<TReturns>) =>
    stub.mockImplementation(() => Promise.resolve(val as TReturns));

  stub.mockResolvedValueOnce = (val: Awaited<TReturns>) =>
    stub.mockImplementationOnce(() => Promise.resolve(val as TReturns));

  stub.mockRejectedValue = (val: unknown) =>
    stub.mockImplementation(() => Promise.reject(val));

  stub.mockRejectedValueOnce = (val: unknown) =>
    stub.mockImplementationOnce(() => Promise.reject(val));

  Object.defineProperty(stub, 'mock', {
    get: () => mockContext,
  });

  stub.willCall(function (this: unknown, ...args) {
    instances.push(this);
    invocations.push(++callOrder);
    const impl =
      onceImplementations.shift() ||
      implementation ||
      stub.getOriginal() ||
      noop;
    return impl.apply(this, args);
  });

  spies.add(stub);

  return stub as any;
}

export function fn<TArgs extends any[] = any[], R = any>(): SpyInstanceFn<
  TArgs,
  R
>;
export function fn<TArgs extends any[] = any[], R = any>(
  implementation: (...args: TArgs) => R,
): SpyInstanceFn<TArgs, R>;
export function fn<TArgs extends any[] = any[], R = any>(
  implementation?: (...args: TArgs) => R,
): SpyInstanceFn<TArgs, R> {
  return enhanceSpy(
    tinyspy.spyOn({fn: implementation || noop}, 'fn'),
  ) as unknown as SpyInstanceFn;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
