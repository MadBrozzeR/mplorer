import { Splux } from 'splux';

import { host } from './common/host';
import { Cover } from './components/cover/cover';

import { Body } from './components/body/body';

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
      padding: '0px',
    }
  }
}

Splux.start(function (body, head) {
  var host = this.host;
  this.use(head).dom(host.styles.target);

  host.router.attach(function (route) {
    host.state.route.set(route);
  });

  host.styles.add('root', STYLE);

  this.dom(Body);

  host.cover = this.dom(Cover);
}, host);
