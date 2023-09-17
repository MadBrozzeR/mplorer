import { Splux } from '/src/lib/splux.js';
import { Styles } from '/src/lib/styles.js';

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

var HASH_RE = /^#(\w+)(\/.*)$/;
var SLASHHH_RE = /\/{2,}/g;
var POP_RE = /[^\/]+(?:\/)?$/;

function Router (callback) {
  var router = this;

  function onHashChange (event) {
    event.preventDefault && event.preventDefault();

    var regMatch = HASH_RE.exec(event.target.location.hash);

    if (regMatch) {
      router.data = {
        user: regMatch[1],
        path: regMatch[2],
      };
    }

    callback(router.data);
  }

  window.addEventListener('hashchange', onHashChange);

  onHashChange({ target: window });
}
Router.prototype.go = function (path) {
  window.location.hash = ('#' + this.data.user + '/' + path).replace(SLASHHH_RE, '/');
}
Router.prototype.push = function (dir) {
  this.go(this.data.path + '/' + dir + '/');
}
Router.prototype.pop = function () {
  this.go(this.data.path.replace(POP_RE, ''));
}

function State (initial) {
  this.state = initial;
  this.listeners = [];
}
State.prototype.set = function (value) {
  if (value === this.state) {
    return;
  }

  for (var index = 0 ; index < this.listeners.length ; ++index) {
    this.listeners[index](value, this.state);
  }

  this.state = value;
}
State.prototype.listen = function (callback) {
  if (callback instanceof Function) {
    this.listeners.push(callback);
    callback(this.state);
  }
}

Splux.start(function (body, head) {
  var host = this.host;

  host.styles = new Styles(head.appendChild(document.createElement('style')));
  host.state = {
    route: new State({}),
  };

  host.router = new Router(function (route) {
    host.state.route.set(route);
  });

  host.styles.add('root', STYLE);

  this.dom(Body);
});
