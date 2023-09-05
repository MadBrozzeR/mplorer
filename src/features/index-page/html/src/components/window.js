import { dom } from '/src/dom.js';
import { bem } from '/src/styles.js';
import { Menu } from './menu.js';

var STYLES = {
  '.window': {
    '--toolbar-size': '32px',

    width: '100%',
    maxWidth: '1000px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',

    '__toolbar': {
      height: 'var(--toolbar-size)',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: '4px',
    },

    '__toolbar-button-wrapper': {
      height: '100%',
      backgroundColor: '#777',
      width: 'var(--toolbar-size)',
      position: 'relative',
    },

    '__toolbar-button': {
      width: '100%',
      height: '100%',
    },

    '__toolbar-title': {
      height: '100%',
      backgroundColor: '#777',
      flex: 1,
    },

    '__content': {
      flex: 1,
      backgroundColor: '#777',
      width: '100%',
    }
  },
};

function Window (parent) {
  var cn = bem('window');

  dom('div', parent, function (windowBlock) {
    windowBlock.className = cn();

    dom('div', windowBlock, function (toolbar) {
      toolbar.className = cn('toolbar');

      dom('div', toolbar, function (buttonWrapper) {
        buttonWrapper.className = cn('toolbar-button-wrapper');

        dom('div', buttonWrapper, function (button) {
          button.className = cn('toolbar-button');

          button.onclick = function () {
            menu.toggle();
          }
        });

        var menu = Menu(buttonWrapper);
      });

      dom('div', toolbar, function (title) {
        title.className = cn('toolbar-title');
      });
    });

    dom('div', windowBlock, function (content) {
      content.className = cn('content');
    });
  });
}

Window.style = function (styles) {
  styles.add('window', STYLES);
  Menu.style(styles);
}

export { Window };
