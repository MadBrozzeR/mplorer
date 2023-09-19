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

    '__interface': {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      opacity: 1,
      transition: '0.2s opacity ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '_hidden': {
        opacity: 0,
      }
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

    '__fullscreen': {
      position: 'absolute',
      right: '44px',
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
  var fullscreen = false;

  host.playlist.set(imagePlaylistFilter(list, path), { file: fileName });

  function set (file) {
    image.src = '/file/' + user + file;
  }

  set(host.playlist.current());

  this.dom('div', function (ifc) {
    var visible = true;
    var clickPropagated = false;

    ifc.className = cn('interface');
    ifc.onclick = function () {
      if (clickPropagated) {
        return;
        clickPropagated = false;
      }

      ifc.className = cn('interface', { hidden: !(visible = !visible) })
    };

    this.dom('div', {
      innerText: '✖',
      className: cn('close'),
      onclick() {
        clickPropagated = true;
        host.cover.close();
        if (fullscreen) {
          document.exitFullscreen();
        }
      }
    });

    this.dom('div', {
      innerText: '□',
      className: cn('fullscreen'),
      onclick: function () {
        clickPropagated = true;
        viewer.requestFullscreen();
        fullscreen = true;
      }
    });

    this.dom('div', {
      innerText: '←',
      className: cn('left'),
      onclick: function () {
        clickPropagated = true;
        set(host.playlist.prev());
      }
    });

    this.dom('div', {
      innerText: '→',
      className: cn('right'),
      onclick: function () {
        clickPropagated = true;
        set(host.playlist.prev());
      }
    });
  })
}
