import { Component } from 'splux';
import { Host, newComponent } from '../../common/host';
import { bem } from '../../lib/bem';

var FLOATER = {
  display: 'block',
  content: '""',
  position: 'absolute',
  width: '10px',
  height: '10px',
  border: '1px solid black',
  transform: 'translate(50%, -50%)',
  backgroundColor: '#ccc',
  transition: '0.4s opacity ease-in-out',
};

var STYLES = {
  '@keyframes floater1': {
    '0%': { top: '0%', right: '0%' },
    '50%': { top: '0%', right: '100%' },
    '100%': { top: '100%', right: '100%' },
  },
  '@keyframes floater2': {
    '0%': { top: '100%', right: '100%' },
    '50%': { top: '100%', right: '0%' },
    '100%': { top: '0%', right: '0%' },
  },

  '.loading-block': {
    position: 'relative',

    '__content': {
      height: '100%',
      transition: '.4s opacity ease-in-out',

      '_dimmed': {
        opacity: 0.4,
      }
    },

    '__cover': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      padding: 0,
      opacity: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      transition: [
        '.4s padding step-end',
        '.4s width step-end',
        '.4s height step-end',
      ].join(','),

      '_visible': {
        width: '100%',
        height: '100%',
        padding: '20px',
        opacity: 1,
        transition: [
          '.4s padding step-start',
          '.4s width step-start',
          '.4s height step-start',
        ].join(','),
      },

      '-inner': {
        width: '100%',
        height: '100%',
        position: 'relative',

        ':before': {
          ...FLOATER,
          animation: '1s floater1 ease-in-out infinite',
        },

        ':after': {
          ...FLOATER,
          animation: '1s floater2 ease-in-out infinite',
        },
      }
    },
  },
};

var cn = bem('loading-block');

type Props = {
  className?: string;
};

type Tags = keyof HTMLElementTagNameMap;

export const LoadingBlock =
  function LoadingBlock<K extends Tags, T> (
    renderer: Component<K, Host, void, T>,
    errorRenderer?: Component<K, Host, void, any>
  ) {
    return newComponent(function (block, params: Props = {}) {
      this.host.styles.add('loading-block', STYLES);
      block.className = bem.join(cn(), params.className);
      let current: Element | null = null;
      const blockSpl = this;

      const contentSpl = this.dom('div', function (content) {
        content.className = 'loading-block__content';

        return this;
      });

      const cover = this.dom('div', function (coverOuter) {
        coverOuter.className = 'loading-block__cover';

        this.dom('div', function (coverInner) {
          coverInner.className = 'loading-block__cover-inner';
        })
      });

      return {
        fetch(promise: Promise<T>) {
          cover.classList.add('loading-block__cover_visible');
          contentSpl.node.classList.add('loading-block__content_dimmed');

          promise.then(function (data) {
            cover.classList.remove('loading-block__cover_visible');
            contentSpl.node.classList.remove('loading-block__content_dimmed');

            if (current) {
              contentSpl.node.removeChild(current);
            }

            current = contentSpl.dom(renderer, data);
          }).catch(function (error) {
            cover.classList.remove('loading-block__cover_visible');
            contentSpl.node.classList.remove('loading-block__content_dimmed');

            if (errorRenderer) {
              if (current) {
                contentSpl.node.removeChild(current);
              }

              current = contentSpl.dom(errorRenderer, error);
            }
          });
        }
      };
    });
};
