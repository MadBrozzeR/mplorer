var HASH_RE = /^#(\w+)(\/.*)$/;
var SLASHHH_RE = /\/{2,}/g;
var POP_RE = /[^\/]+(?:\/)?$/;

export function Router (callback) {
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
