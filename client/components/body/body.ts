import { newComponent } from '../../common/host';
import { Files } from '../files/files';
import { Header } from '../header/header';

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

export const Body = newComponent('div', function (body) {
  this.host.styles.add('body', STYLE);

  var host = this.host;

  body.className = 'main-block';

  this.dom(Header);
  this.dom(Files);
});
