import {fn} from '@/spy';

export const MockEventEmitter = class MockEventEmitter
  implements Micra.EventEmitter
{
  on = fn();
  emit = fn();
  emitSync = fn();
};
