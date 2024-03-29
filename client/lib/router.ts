var HASH_RE = /^#(\w+)(\/.*)$/;
var SLASHHH_RE = /\/{2,}/g;
var POP_RE = /[^\/]+(?:\/)?$/;

export type RouterData = {
  user: string;
  path: string;
};

function isWindow (target: EventTarget | null): target is Window {
  return target === window;
}

export class Router {
  action: (data: RouterData) => void = function () {};
  data: RouterData | null = null;

  attach(callback: (data: RouterData) => void) {
    var router = this;

    function handleHashChange (event: HashChangeEvent | { target: Window }) {
      if (isWindow(event.target)) {
        'preventDefault' in event && event.preventDefault();

        var regMatch = HASH_RE.exec(event.target.location.hash);

        if (regMatch) {
          router.data = {
            user: regMatch[1] || '',
            path: regMatch[2] || '',
          };
        }

        router.data && callback(router.data);
      }
    }

    window.addEventListener('hashchange', handleHashChange);

    handleHashChange({ target: window });
  }

  go(path: string) {
    if (this.data) {
      window.location.hash = ('#' + this.data.user + '/' + path).replace(SLASHHH_RE, '/');
    }
  }

  push(dir: string) {
    if (this.data) {
      this.go(this.data.path + '/' + dir + '/');
    }
  }

  pop() {
    if (this.data) {
      this.go(this.data.path.replace(POP_RE, ''));
    }
  }
}
