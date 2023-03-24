/* eslint-disable @typescript-eslint/no-empty-function */
/// <reference types="@micra/core/kernel" />
import type {Constructor} from '@micra/core/utilities/Constructor';
import {fn} from '../spy';

export const MockAsyncKernel = class MockAsyncKernel implements Micra.Kernel {
  run = fn(async () => {});
  boot = fn(async () => {});
  static with(partial: Micra.Kernel): Constructor<Micra.Kernel> {
    return class ExtendedMockAsyncKernel extends MockAsyncKernel {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};

export const MockKernel = class MockKernel implements Micra.Kernel {
  run = fn();
  boot = fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.Kernel
   * @returns Constructor Micra.Kernel
   */
  static with(partial: Micra.Kernel): Constructor<Micra.Kernel> {
    return class ExtendedMockKernel extends MockKernel {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
