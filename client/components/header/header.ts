import type { Component } from 'splux';
import { newComponent } from '../../common/host';
import { ICONS } from '../svg/icon';

var STYLE = {
  '.header': {
    height: '36px',
    display: 'flex',
    alignItems: 'center',
  },
  '.header-menu': {
    width: '36px',
    height: '36px',
    backgroundColor: '#224',
    border: '1.5px solid #99f',
    borderRadius: '2px',
    fontWeight: 700,
    cursor: 'pointer',
    boxSizing: 'border-box',

    ':hover': {
      backgroundColor: '#336',
    },
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
    border: '1px solid #225',
    borderWidth: '1px 0',
    color: '#ccf',
  },
  '.header-back': {
    color: '#99f',
    width: '36px',
    height: '36px',
    backgroundColor: '#224',
    border: '1.5px solid #99f',
    borderRadius: '2px',
    fontWeight: 700,
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',

    ':hover': {
      backgroundColor: '#336',
    },
  },
};

var FLOATING_SLASH_RE = /^\/+|\/+$/g;

export const Header = newComponent('div', function Header (header) {
  header.node.className = 'header';
  var host = header.host;
  host.styles.add('header', STYLE);

  header.dom('button', function (button) {
    button.setParams({
      className: 'header-back',
      onclick: function (event) {
        event.preventDefault();
        host.router.pop();
      },
    });

    const icon = ICONS.BACK('header-back-icon');
    button.dom(icon.node);
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
