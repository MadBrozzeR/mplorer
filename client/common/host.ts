import { Splux } from 'splux';
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
  cover: null as { set(component, props): void, close(): void } | null,
};

export const newComponent = Splux.createComponent<typeof host>();
