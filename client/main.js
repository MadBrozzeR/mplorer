import { Splux } from '/src/splux.js';
import { Styles } from '/src/mbr-style.js';

import { Cover } from '/src/components/cover/cover.js';
import { Router } from './lib/router.js';
import { State } from './lib/state.js';
import { Playlist } from './lib/playlist.js';

import { Body } from '/src/components/body/body.js';

const STYLE = {
  'html, body': {
    height: '100%',
    margin: 0,
    boxSizing: 'border-box',
  },

  'body': {
    padding: '16px',
    font: '18px/20px sans-serif',
    backgroundColor: '#002',
    color: '#eee',
  },

  '@media (max-width: 640px)': {
    'body': {
      padding: '8px',
    }
  }
}

Splux.start(function (body, head) {
  var host = this.host;

  host.styles = new Styles(head.appendChild(document.createElement('style')));
  host.state = {
    route: new State({}),
  };
  host.playlist = new Playlist();

  host.router = new Router(function (route) {
    host.state.route.set(route);
  });

  host.styles.add('root', STYLE);

  this.dom(Body);
  this.host.cover = this.dom(Cover);
});
