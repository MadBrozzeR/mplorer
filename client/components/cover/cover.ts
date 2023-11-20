import { bem } from '../../lib/bem';
import { newComponent } from '../../common/host';

var cn = bem('cover');

var STYLE = {
  '.cover__curtain': {
    position: 'fixed',
    top: 0,
    left: 0,
    // width: '0%',
    height: '0%',
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(200, 200, 200, 0.4)',

    '_active': {
      width: '100%',
      height: '100%',
    }
  }
};

export const Cover = newComponent('div', function Cover (curtain) {
  curtain.className = cn('curtain');
  this.host.styles.add('cover', STYLE);
  var container = this;

  // TODO replace any
  function set (component: any, params: any) {
    curtain.innerText = '';
    container.dom(component, params);
    curtain.className = cn('curtain', { active: true });
  }

  function close () {
    curtain.className = cn('curtain');
  }

  return { set, close };
});
