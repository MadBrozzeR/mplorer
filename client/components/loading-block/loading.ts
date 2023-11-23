import { Component } from 'splux';
import { Host, newComponent } from '../../common/host';
import { bem } from '../../lib/bem';

var STYLES = {
  '.loading-block': {
    position: 'relative',
  }
};

var cn = bem('loading-block');

type Props = {
  className?: string;
};

type Tags = keyof HTMLElementTagNameMap;

const LoadingBlock =
  function LoadingBlock<K extends Tags, T> (
    renderer: Component<K, Host, void, T>,
    errorRenderer?: Component<K, Host, void, any>
  ) {
    newComponent(function (block, params: Props = {}) {
      block.className = bem.join(cn(), params.className);
      let current: Element | null = null;
      const blockSpl = this;

      this.host.styles.add('loading-block', STYLES);

      return {
        fetch(promise: Promise<T>) {
          // request
          promise.then(function (data) {
            // response
            if (current) {
              block.removeChild(current);
            }

            current = blockSpl.dom(renderer, data);
          }).catch(function (error) {
            // error
            if (errorRenderer) {
              if (current) {
                block.removeChild(current);
              }

              current = blockSpl.dom(errorRenderer, error);
            }
          });
        }
      };
    });
};
