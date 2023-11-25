import { Splux } from 'splux';

import { host } from './common/host';
import { Cover } from './components/cover/cover';

import { Body } from './components/body/body';
import { CommonDefs, injectStyles } from './components/svg/icon';

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
  var host = body.host;
  injectStyles(host.styles);
  host.styles.add('root', STYLE);

  host.router.attach(function (route) {
    host.state.assign({ route });
  });

  host.state.broadcastTo(body);

  head.dom(host.styles.target);
  body.dom(CommonDefs.svg);
  body.dom(Body);

  host.cover = body.dom(Cover);
}, host);
