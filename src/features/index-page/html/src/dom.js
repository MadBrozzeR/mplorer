// mbr-dom
import { render } from '/src/styles.js';

function deepSpread (fromObject, toObject) {
  for (var key in fromObject) {
    if (fromObject[key] instanceof Object) {
      toObject[key] = toObject[key] || {};

      deepSpread(fromObject[key], toObject[key]);
    } else {
      toObject[key] = fromObject[key];
    }
  }
}

function DOM (tag, parent, params) {
  this.dom = document.createElement(tag);

  if (parent instanceof DOM) {
    parent.dom.appendChild(this.dom);
  } else if (parent instanceof HTMLElement) {
    parent.appendChild(this.dom);
  }

  if (params instanceof Function) {
    params.call(this, this.dom);
  } else if (params instanceof Object) {
    deepSpread(params, this.dom)
  }
};

DOM.prototype.append = function (element) {
  if (element instanceof DOM) {
    this.dom.appendChild(element.dom);
  } else if (element instanceof HTMLElement) {
    this.dom.appendChild(element);
  }

  return this;
}

function dom (tag, parent, params) {
  return new DOM(tag, parent, params);
}

export { dom };
