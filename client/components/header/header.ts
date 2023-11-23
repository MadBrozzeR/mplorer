import type { Component } from 'splux';
import { newComponent } from '../../common/host';

var STYLE = {
  '.header': {
    height: '36px',
    display: 'flex',
    alignItems: 'center',
  },
  '.header-menu': {
    width: '36px',
    height: '36px',
    backgroundColor: '#557',
  },
  '.header-title': {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '36px',
    backgroundColor: '#113',
    lineHeight: '36px',
    padding: '0 8px',
  },
  '.header-back': {
    width: '36px',
    height: '36px',
    backgroundColor: '#557',
    border: '0',
  },
};

var FLOATING_SLASH_RE = /^\/+|\/+$/g;

export const Header = newComponent('div', function Header (header) {
  header.node.className = 'header';
  var host = header.host;
  host.styles.add('header', STYLE);

  header.dom('button', {
    className: 'header-back',
    innerText: '<',
    onclick: function (event) {
      event.preventDefault();
      host.router.pop();
    },
  });

  header.dom('div', function (title) {
    title.node.className = 'header-title';

    header.host.state.route.listen(function (route) {
      var path = decodeURIComponent(route.path).replace(FLOATING_SLASH_RE, '');
      var slashIndex = path.lastIndexOf('/');
      title.node.innerText = path === '' ? '/' : path.substring(slashIndex + 1);
    });
  });

  header.dom('div', { className: 'header-menu' });
});
