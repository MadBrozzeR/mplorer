import { AppState, Cast } from './host';
import { Particle } from './types';

export function isKeyOf<T extends {}> (key: string | number | symbol, set: T): key is keyof T {
  return key in set;
}

export function tuneInState (listeners: { [K in keyof AppState]?: (data: AppState[K]) => void }) {
  return function (cast: Cast) {
    if (cast.type === 'stateChange') {
      for (const key in listeners) {
        if (isKeyOf(key, cast.data.state) && cast.data.state[key] !== cast.data.lastState[key]) {
          listeners[key]?.(cast.data.state[key] as any);
        }
      }
    }
  }
}

export function requestForState<D> (promise: Promise<D>, callback: (particle: Partial<Particle<D>>) => void) {
  callback({ status: 'pending' });
  promise.then(function (data) {
    callback({ status: 'success', data: data, error: '' });
  }).catch(function (error) {
    if (error instanceof Error) {
      callback({ status: 'failed', error: error.message });
    }
  });
}

export function initParticle<D> (initial: D | null): Particle<D> {
  return {
    status: 'initial',
    data: initial,
    error: '',
  };
}
