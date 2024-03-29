import { State } from 'mbr-state';
import { Splux } from 'splux';

export function stateClosure<S extends {}> (state: S) {
  var lastState = state;
  const initialState = state;
  const appState = new State(state);

  return {
    broadcastTo(splux: Splux<any, any>) {
      appState.listen(function (state) {
        Promise.resolve().then(function () {
          splux.broadcast({ type: 'stateChange', data: { state, lastState } });
          lastState = state;
        });
      });
    },
    assign(state: Partial<S> | ((state: S) => Partial<S>)) {
      if (state instanceof Function) {
        appState.assign(state(appState.state));
      } else {
        appState.assign(state);
      }
    },
    get<K extends keyof S>(key: K) {
      return lastState[key];
    },
    getAll() {
      return lastState;
    },
    reset<K extends keyof S>(key: K) {
      if (initialState[key] !== lastState[key]) {
        const value: Partial<S> = {};
        value[key] = initialState[key];
        this.assign(value);
      }
    }
  }
}
