import { bem } from '/src/lib/styles.js';

var STYLE = {
  '.image-viewer': {
    width: '100%',
    maxWidth: '1000px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

    '__image': {
      maxWidth: '100%',
      maxHeight: '100%',
    },

    '__close': {
      position: 'absolute',
      right: '16px',
      top: '16px',
      width: '24px',
      height: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      border: '2px solid #eee',
      borderRadius: '50%',
      opacity: .4,
    },

    '__left': {
      position: 'absolute',
      left: '16px',
      width: '24px',
      height: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      border: '2px solid #eee',
      borderRadius: '50%',
      opacity: .4,
    },

    '__right': {
      position: 'absolute',
      right: '16px',
      width: '24px',
      height: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      border: '2px solid #eee',
      borderRadius: '50%',
      opacity: .4,
    }
  },
};

var cn = bem('image-viewer');

function getExtension (file) {
  var index = file.lastIndexOf('.');

  if (index > -1) {
    return file.substring(index + 1);
  }

  return '';
}

var IMAGE_EXTENSIONS = {
  png: true,
  jpg: true,
  jpeg: true,
  svg: true,
  gif: true,
  webp: true,
};

function imagePlaylistFilter (list, path) {
  var result = [];
  var extension, name;

  for (var index = 0 ; index < list.length ; ++index) {
    name = list[index].name;
    extension = getExtension(name);

    if (extension in IMAGE_EXTENSIONS) {
      result.push(path + name);
    }
  }

  return result;
}

export function ImageViewer (viewer, { file, list }) {
  viewer.className = cn();
  var host = this.host;
  var user = host.state.route.state.user;
  var path = host.state.route.state.path;
  var fileName = path + file.name;
  this.host.styles.add('image-viewer', STYLE);
  var image = this.dom('img', { className: cn('image') });

  host.playlist.set(imagePlaylistFilter(list, path), { file: fileName });

  function set (file) {
    image.src = '/file/' + user + file;
  }

  set(host.playlist.current());

  this.dom('div', {
    innerText: '✖',
    className: cn('close'),
    onclick() {
      host.cover.close();
    }
  });

  this.dom('div', {
    innerText: '←',
    className: cn('left'),
    onclick: function () {
      set(host.playlist.prev());
    }
  });

  this.dom('div', {
    innerText: '→',
    className: cn('right'),
    onclick: function () {
      set(host.playlist.prev());
    }
  });
}
