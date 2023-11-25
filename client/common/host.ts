import { Splux, Component } from 'splux';
import { Styles } from 'mbr-style';
import { State } from 'mbr-state';
import { Playlist } from '../lib/playlist';
import { Router, RouterData } from '../lib/router';
import { Broadcast, Particle } from './types';
import { stateClosure } from './state';
import { FileData } from '../common/types';

const initialState = {
  route: null as RouterData | null,
  files: {
    status: 'initial',
    data: null,
    error: '',
  } as Particle<FileData[]>,
};

export const host = {
  styles: Styles.create(),
  state: stateClosure(initialState),
  playlist: new Playlist(),
  router: new Router(),
  cover: null as CoverIFC | null,
};

export type Host = typeof host;

export type CoverIFC = {
  set<C, E>(component: Component<'div', Host, void, E>, params: E): void;
  close(): void;
}

export type AppState = typeof initialState;

export type Cast = Broadcast<'stateChange', {
  state: AppState;
  lastState: AppState;
}>;

export const newComponent = Splux.createComponent<Host>();
