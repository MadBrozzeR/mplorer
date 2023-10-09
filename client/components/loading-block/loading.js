import { bem } from '/src/lib/bem.js';

var STYLES = {
  '.loading-block': {
    position: 'relative',
  }
};

var cn = bem('loading-block');

function LoadingBlock (block, params = {}) {
  block.className = bem.join(cn(), params.className);

  this.host.styles.add('loading-block', STYLES);

  return {
    
  };
}
LoadingBlock.tag = 'div';
