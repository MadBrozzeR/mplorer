import { dom } from '/src/dom.js';
import { Styles } from '/src/styles.js';
import { Window } from '/src/components/window.js';

var STYLES = {
  'html,body': {
    height: '100%',
    margin: 0,
    backgroundColor: '#002',
  },
  '.main': {
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

window.onload = function () {
  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  var styles = new Styles(head.appendChild(document.createElement('style')));

  dom('div', body, function (main) {
    main.className = 'main';
    styles.add('root', STYLES);

    Window.style(styles);
    Window(main);
  });
}
