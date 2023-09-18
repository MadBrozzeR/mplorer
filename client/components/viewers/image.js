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

export function ImageViewer (viewer, file) {
  viewer.className = cn();
  const host = this.host;
  var user = host.state.route.state.user;
  this.host.styles.add('image-viewer', STYLE);
  var fileName = host.state.route.state.path + file.name;
  this.dom('img', { src: '/file/' + user + '/' + fileName, className: cn('image') });

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
  });

  this.dom('div', {
    innerText: '→',
    className: cn('right'),
  });
}
