/* eslint-disable @typescript-eslint/no-empty-function */
import type {Static} from '@micra/core/utilities/Static';
import {fn} from '@/spy';

export const MockAsyncKernel = class MockAsyncKernel implements Micra.Kernel {
  run = fn(async () => {});
  boot = fn(async () => {});
  static with(partial: Micra.Kernel): Static<Micra.Kernel> {
    return class ExtendedMockAsyncKernel extends MockAsyncKernel {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};

export const MockKernel = class MockKernel implements Micra.Kernel {
  run = vi.fn();
  boot = vi.fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.Kernel
   * @returns Static Micra.Kernel
   */
  static with(partial: Micra.Kernel): Static<Micra.Kernel> {
    return class ExtendedMockKernel extends MockKernel {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
