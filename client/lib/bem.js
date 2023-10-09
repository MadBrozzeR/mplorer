export function bem (blockName) {
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
bem.join = function () {
  var result = '';

  for (var index = 0 ; index < arguments.length ; ++index) {
    if (arguments[index]) {
      result += (result ? ' ' : '') + arguments[index];
    }
  }

  return result;
}
