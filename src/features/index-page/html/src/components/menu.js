import { dom } from '/src/dom.js';
import { bem } from '/src/styles.js';
import { MEDIA } from '/src/media.js';

var STYLES = {
  '.menu': {
    position: 'absolute',
    top: '100%',
    left: 0,
    display: 'none',
    width: '300px',
    height: '400px',
    backgroundColor: '#aaa',

    '_visible': {
      display: 'block',
    }
  },

  [MEDIA.LT480]: {
    '.menu': {
      width: 'auto',
      height: 'auto',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
}

function Menu (parent) {
  var cn = bem('menu');
  var isClicked = false;

  var state = {
    isVisible: false,
  };

  function setState (newState, isForced) {
    var modifiedState = Object.assign({}, state, newState);

    if (isForced || modifiedState.isVisible !== state.isVisible) {
      root.dom.className = cn('', { visible: modifiedState.isVisible });
    }

    state = modifiedState;
  }

  var root = dom('div', parent, function (menu) {
    menu.onclick = function () {
      isClicked = true;
    };
  });

  document.addEventListener('click', function () {
    if (state.isVisible && !isClicked) {
      setState({ isVisible: false });
    }

    isClicked = false;
  });

  setState(state, true);

  return {
    content: function (element) {
      root.dom.innerText = '';

      root.append(element);
    },
    toggle: function () {
      if (!state.isVisible) {
        isClicked = true;
      }
      setState({ isVisible: !state.isVisible });
    }
  };
}

Menu.style = function (styles) {
  styles.add('menu', STYLES);
}

export { Menu };
