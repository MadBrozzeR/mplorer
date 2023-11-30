import { newComponent } from '../../common/host';
import { Files } from '../files/files';
import { Header } from '../header/header';
import { Toolbar } from '../toolbar/toolbar';

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

export const Body = newComponent(function (body) {
  const host = body.host;

  host.styles.add('body', STYLE);

  body.setParams({ className: 'main-block' });

  body.dom(Header);
  body.dom(Files);
  body.dom(Toolbar);
});
