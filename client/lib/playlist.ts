type PlaylistOptions = {
  index?: number;
  file?: string;
  loop?: boolean;
}
export class Playlist {
  loop = true;
  index = 0;
  list: string[] = [];

  constructor(list?: string[]) {
    this.loop = true;
    this.index = 0;
    this.set(list);
  }

  set(list?: string[], { index, file, loop }: PlaylistOptions = {}) {
    this.loop = loop === undefined ? this.loop : loop;
    this.list = list || [];
    this.index = index || 0;

    if (file) {
      this.use(file);
    }

    return this;
  }

  use(name: string) {
    var index = this.list.indexOf(name);

    if (index > -1) {
      this.index = index;

      return name;
    }

    return null;
  }

  current() {
    return this.list[this.index] || null;
  }

  relativeIndex(value: number) {
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

  relative(value: number) {
    var newIndex = this.relativeIndex(value);

    return newIndex > -1 && this.list[newIndex] || null;
  }

  next() {
    var next = this.relativeIndex(1);

    if (!this.list[next]) {
      return null;
    }

    this.index = next;

    return this.current();
  }

  prev() {
    var prev = this.relativeIndex(-1);

    if (!this.list[prev]) {
      return null;
    }

    this.index = prev;

    return this.current();
  }
}
