import { bem } from '../../lib/bem';
import { CoverIFC, Host, newComponent } from '../../common/host';
import { Splux } from 'splux';

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
  curtain.setParams({ className: 'cover__curtain' });
  curtain.host.styles.add('cover', STYLE);
  let content: Splux<HTMLDivElement, Host> | null = null;

  const ifc: CoverIFC = {
    set(component, params) {
      content && content.remove();
      content = curtain.dom(component, params);
      curtain.node.classList.add('cover__curtain_active');
    },

    close() {
      curtain.node.classList.remove('cover__curtain_active');
    }
  };

  return ifc;
});
