type Modifiers = Record<string, boolean | string>;

export function bem (blockName: string) {
  return function (elementName?: string, modifiers?: Modifiers) {
    var base = blockName;
    var result: string[] = [];

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
bem.join = function (...args: string[]) {
  var result = '';

  for (var index = 0 ; index < args.length ; ++index) {
    if (args[index]) {
      result += (result ? ' ' : '') + args[index];
    }
  }

  return result;
}
