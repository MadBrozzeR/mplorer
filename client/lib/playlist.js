export function Playlist (list) {
  this.loop = true;
  this.index = 0;
  this.set(list);
}
Playlist.prototype.set = function (list, { index, file, loop } = {}) {
  this.loop = loop === undefined ? this.loop : loop;
  this.list = list || [];
  this.index = index || 0;

  if (file) {
    this.use(file);
  }

  return this;
}
Playlist.prototype.use = function (name) {
  var index = this.list.indexOf(name);

  if (index > -1) {
    this.index = index;

    return name;
  }

  return null;
}
Playlist.prototype.current = function () {
  return this.list[this.index] || null;
}
Playlist.prototype.relativeIndex = function (value) {
  var newIndex = this.index + value;

  if (this.loop) {
    var shift = newIndex % this.list.length;

    return shift < 0 ? (this.list.length + shift) : shift;
  }

  if (this.list[newIndex]) {
    return newIndex;
  }

  return -1;
}
Playlist.prototype.relative = function (value) {
  var newIndex = this.relativeIndex(value);

  return newIndex > -1 ? this.list[newIndex] : null;
}
Playlist.prototype.next = function () {
  var next = this.relativeIndex(1);

  if (!this.list[next]) {
    return null;
  }

  this.index = next;

  return this.current();
}
Playlist.prototype.prev = function () {
  var prev = this.relativeIndex(-1);

  if (!this.list[prev]) {
    return null;
  }

  this.index = prev;

  return this.current();
}
