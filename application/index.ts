/* eslint-disable @typescript-eslint/no-empty-function */
import {MockConfiguration} from '../configuration';
import {MockEnvironment} from '../environment';
import {MockEventEmitter} from '../event-emitter';
import {MockKernel} from '../kernel';
import {MockServiceContainer} from '../service-container';
import {fn} from '../spy';
import type {Constructor} from '@micra/core/utilities/Constructor';

export const MockApplication = class MockApplication
  extends MockEventEmitter
  implements Micra.Application
{
  configuration = new MockConfiguration();
  container = new MockServiceContainer();
  environment = new MockEnvironment();
  kernel = new MockKernel();
  serviceProviders = [];
  initializeProviders = fn(async () => {});
  initializeProvidersSync = fn();
  run = fn(async () => {}) as Micra.Application['run'];
  runSync = fn();
  start = fn(async () => {});
  startSync = fn();
  globals = {app: false, use: false, config: false, env: false};
  terminate = fn();
  createScope = fn();
  /**
   * It allows you to pass custom mocked functions which will be set to the instance.
   *
   * @param partial Partial of the Micra.Application
   * @returns Constructor Micra.Application
   */
  static with(partial: Micra.Application): Constructor<Micra.Application> {
    return class ExtendedMockApplication extends MockApplication {
      constructor() {
        super();
        Object.assign(this, partial);
      }
    };
  }
};
