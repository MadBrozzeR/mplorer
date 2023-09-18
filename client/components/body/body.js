import { Files } from '/src/components/files/files.js';
import { Header } from '/src/components/header/header.js';

const STYLE = {
  '.main-block': {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '100%',
    maxWidth: '1000px',
    height: '100%',
    gap: '8px',
  },
};

export function Body (body) {
  this.host.styles.add('body', STYLE);

  var host = this.host;

  body.className = 'main-block';

  this.dom(Header);
  this.dom(Files);
};

Body.tag = 'div';
