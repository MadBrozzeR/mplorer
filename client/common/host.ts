import { Splux, Component } from 'splux';
import { Styles } from 'mbr-style';
import { State } from 'mbr-state';
import { Playlist } from '../lib/playlist';
import { Router, RouterData } from '../lib/router';

export const host = {
  styles: Styles.create(),
  state: {
    route: new State(null as RouterData | null),
  },
  playlist: new Playlist(),
  router: new Router(),
  cover: null as CoverIFC | null,
};

export type Host = typeof host;

export type CoverIFC = {
  set<C, E>(component: Component<'div', Host, void, E>, params: E): void;
  close(): void;
}

export const newComponent = Splux.createComponent<Host>();
