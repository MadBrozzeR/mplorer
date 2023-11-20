export function State (initial) {
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
