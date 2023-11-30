import { AppState, Cast } from './host';
import { Particle } from './types';

type CastData<T extends string> = Extract<Cast, { type: T }>['data'];

// TODO Remove as unused
export function tune(tunner: { [key in Cast['type']]?: (data: CastData<key>) => void }) {
  return function (cast: Cast) {
    if (cast.type in tunner) {
      const data = cast.data;
      tunner[cast.type](cast.data as any);
    }
  }
}

export function tuneInState<T extends keyof AppState> (listeners: { [K in keyof AppState]?: (data: AppState[K]) => void }) {
  return function (cast: Cast) {
    if (cast.type === 'stateChange') {
      for (const key in listeners) {
        if (cast.data.state[key] !== cast.data.lastState[key]) {
          listeners[key](cast.data.state[key]);
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
