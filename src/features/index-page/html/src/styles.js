var RE = {
  CAPITAL_SYMBOL: /[A-Z]/g
};

function fromCamel(letter) {
  return '-' + letter.toLowerCase();
}

var camel = {
  from: function(string) {
    return string.replace(RE.CAPITAL_SYMBOL, fromCamel);
  }
}

function toStyles(styleObject, parent) {
  var rules = [];
  var children = {};
  var styles = [];
  var key;
  parent = parent || '';

  for (key in styleObject) {
    if (styleObject[key] instanceof Object) {
      children[key] = styleObject[key];
    } else {
      if (key[0] === '@') {
        rules.push(camel.from(key) + ' ' + styleObject[key] + ';')
      } else {
        rules.push(camel.from(key) + ':' + styleObject[key] + ';');
      }
    }
  }

  (rules.length && parent) && styles.push({ selector: parent, rules: rules });
  for (key in children) {
    if (key[0] === '@') {
      styles.push({ selector: parent + key, group: toStyles(children[key]) });
    } else {
      styles = styles.concat(toStyles(children[key], parent + key));
    }
  }

  return styles;
}

function renderAll(styles) {
  var string = '';

  for (var index = 0; index < styles.length; index++) {
    string += styles[index].selector +
      (styles[index].types ? (' ' + styles[index].types.join(', ')) : '') +
      '{' +
      (styles[index].rules ? styles[index].rules.join('') : '') +
      (styles[index].group ? renderAll(styles[index].group) : '') +
      '}';
  }
  return string;
}

function render (stylesObject) {
  return renderAll(toStyles(stylesObject));
}

function Styles (target) {
  this.target = target;
  this.styles = {};
  this.isRenderQueued = false;
}
Styles.prototype.toString = function () {
  var result = '';

  for (var key in this.styles) {
    result += render(this.styles[key]);
  }

  return result;
}
Styles.prototype.render = function () {
  var styles = this;

  if (!this.isRenderQueued) {
    this.isRenderQueued = true;

    Promise.resolve().then(function () {
      styles.target.textContent = styles.toString();
      styles.isRenderQueued = false;
    });
  }
}
Styles.prototype.add = function (key, styles) {
  this.styles[key] = styles;
  this.render();
}
Styles.prototype.del = function (key) {
  delete this.styles[key];
  this.render();
}

function bem (blockName) {
  return function (elementName, modifiers) {
    var base = blockName;
    var result = [];

    if (elementName) {
      base += '__' + elementName;
    }

    result.push(base);

    if (modifiers instanceof Object) for (var key in modifiers) {
      if (modifiers[key] === true) {
        result.push(base + '_' + key);
      } else if (typeof modifiers[key] === 'string') {
        result.push(base + '_' + key + '_' + modifiers[key]);
      }
    }

    return result.join(' ');
  }
}

export { render, Styles, bem };
