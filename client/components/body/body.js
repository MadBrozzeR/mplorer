import { Files } from '/src/components/files/files.js';

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
  '.header': {
    height: '40px',
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

export function Body (body) {
  this.host.styles.add('body', STYLE);

  var host = this.host;

  body.className = 'main-block';

  this.dom('div', function (header) {
    header.className = 'header';
    var host = this.host;

    this.dom('button', function (back) {
      back.className = 'header-back';
      back.innerText = '<';
      back.onclick = function (event) {
        event.preventDefault();
        host.router.pop();
      };
    });

    this.dom('div', function (title) {
      title.className = 'header-title';

      this.host.state.route.listen(function (route) {
        var path = decodeURIComponent(route.path).replace(FLOATING_SLASH_RE, '');
        var slashIndex = path.lastIndexOf('/');
        console.log(path, slashIndex);
        title.innerText = path === '' ? '/' : path.substring(slashIndex + 1);
      });
    });

    this.dom('div', { className: 'header-menu' });
  });

  this.dom(Files);
};

Body.tag = 'div';
