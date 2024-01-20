import { bem } from '../../lib/bem';
import { Host } from '../../common/host';
import type { FileData } from '../../common/types';
import type { Viewer } from '../files/types';
import { Splux } from 'splux';

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

function getExtension (file: string) {
  var index = file.lastIndexOf('.');

  if (index > -1) {
    return file.substring(index + 1);
  }

  return '';
}

export var IMAGE_SUPPORT = {
  png: true,
  jpg: true,
  jpeg: true,
  svg: true,
  gif: true,
  webp: true,
};

function imagePlaylistFilter (list: FileData[], path: string) {
  const result = [];
  var extension: string, name: string;

  for (var index = 0 ; index < list.length ; ++index) {
    name = list[index]?.name || '';
    extension = getExtension(name);

    if (extension in IMAGE_SUPPORT) {
      result.push(path + name);
    }
  }

  return result;
}

export const ImageViewer: Viewer<'ImageViewer'> = function ImageViewer (viewer, { file, list }) {
  viewer.node.className = cn();
  const host = viewer.host;
  const route = host.state.get('route');
  const user = route?.user || '';
  const path = route?.path || '';
  const fileName = path + file.name;
  viewer.host.styles.add('image-viewer', STYLE);
  const images: Record<string, Splux<HTMLImageElement, Host>> = {};
  let current: Splux<HTMLImageElement, Host> | null = null;
  let fullscreen = false;

  host.playlist.set(imagePlaylistFilter(list, path), { file: fileName });

  function set (file: string | null) {
    if (current) {
      viewer.remove(current);
    }

    if (!file) {
      return;
    }

    current = getImage(file);
    getImage(host.playlist.relative(-2));
    getImage(host.playlist.relative(-1));
    getImage(host.playlist.relative(1));
    getImage(host.playlist.relative(2));

    current && viewer.dom(current);
  }

  function getImage (file: string | null) {
    if (!file) {
      return null;
    }

    const imageFile = images[file];

    if (imageFile) {
      return imageFile;
    }

    var img = new Image();
    img.src = '/file/' + user + file;
    img.className = cn('image');
    const image = viewer.use(null).dom(img);
    images[file] = image;

    return image;
  }

  set(host.playlist.current());

  viewer.dom('div', function (ifc) {
    var visible = true;
    var clickPropagated = false;

    ifc.node.className = cn('interface');
    ifc.node.onclick = function () {
      if (clickPropagated) {
        clickPropagated = false;
        return;
      }

      ifc.node.className = cn('interface', { hidden: !(visible = !visible) })
    };

    ifc.dom('div').params({
      innerText: '✖',
      className: cn('close'),
      onclick: function () {
        clickPropagated = true;
        host.cover?.close();
        if (fullscreen) {
          document.exitFullscreen();
        }
      }
    });

    ifc.dom('div').params({
      innerText: '□',
      className: cn('fullscreen'),
      onclick: function () {
        clickPropagated = true;

        if (fullscreen) {
          document.exitFullscreen();
          fullscreen = false;
        } else {
          viewer.node.requestFullscreen();
          fullscreen = true;
        }
      }
    });

    ifc.dom('div').params({
      innerText: '←',
      className: cn('left'),
      onclick: function () {
        clickPropagated = true;
        set(host.playlist.prev());
      }
    });

    ifc.dom('div').params({
      innerText: '→',
      className: cn('right'),
      onclick: function () {
        clickPropagated = true;
        set(host.playlist.next());
      }
    });
  })
};
ImageViewer.type = 'ImageViewer';
