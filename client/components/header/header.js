var STYLE = {
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

export function Header (header) {
  header.className = 'header';
  var host = this.host;
  host.styles.add('header', STYLE);

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
      title.innerText = path === '' ? '/' : path.substring(slashIndex + 1);
    });
  });

  this.dom('div', { className: 'header-menu' });
}
