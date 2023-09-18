function Splux (node, host) {
  this.node = node || null;
  this.host = host || {};
}
Splux.prototype.clone = function (node) {
  return new Splux(node, this.host);
};

Splux.start = function (callback) {
  var listener = function () {
    window.removeEventListener('load', listener);
    var body = document.getElementsByTagName('body')[0];
    var head = document.getElementsByTagName('head')[0];

    callback.call(new Splux(body), body, head);
  };
  window.addEventListener('load', listener);
}

function deepSpread (fromObject, toObject) {
  for (var key in fromObject) {
    if (fromObject[key].constructor === Object) {
      toObject[key] = toObject[key] || {};

      deepSpread(fromObject[key], toObject[key]);
    } else {
      toObject[key] = fromObject[key];
    }
  }
}

Splux.prototype.dom = function () {
  var tag, params, extra;

  if (arguments[0] instanceof Function) {
    tag = arguments[0].tag || 'div';
    params = arguments[0];
    extra = arguments[1];
  } else {
    tag = arguments[0];
    params = arguments[1];
    extra = arguments[2];
  }

  var element = document.createElement(tag);

  if (this.node) {
    this.node.appendChild(element);
  }

  if (params instanceof Function) {
    return params.call(this.clone(element), element, extra) || element;
  }

  if (params instanceof Object) {
    deepSpread(params, element);

    return element;
  }
};

export { Splux };
