import { Splux, Component } from 'splux';
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
  transition: '1s opacity ease-in-out',
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
        '.4s opacity ease-in-out',
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
          '.4s opacity ease-in-out',
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
type AnySplux = Splux<HTMLElementTagNameMap[Tags], Host>;

export const LoadingBlock =
  function LoadingBlock<K extends Tags, T> (
    renderer: Component<K, Host, void, T>,
    errorRenderer?: Component<K, Host, void, any>
  ) {
    return newComponent(function (block, params: Props = {}) {
      block.host.styles.add('loading-block', STYLES);
      block.node.className = bem.join(cn(), params.className);
      let current: AnySplux | null = null;

      const content = block.dom('div', { className: 'loading-block__content' });

      const cover = block.dom('div', function (coverOuter) {
        coverOuter.node.className = 'loading-block__cover';

        coverOuter.dom('div', function (coverInner) {
          coverInner.node.className = 'loading-block__cover-inner';
        });
      });

      function set(data: T | null | Error) {
        if (data === null) {
          cover.node.classList.add('loading-block__cover_visible');
          content.node.classList.add('loading-block__content_dimmed');
        } else if (data instanceof Error) {
          cover.node.classList.remove('loading-block__cover_visible');
          content.node.classList.remove('loading-block__content_dimmed');

          if (errorRenderer) {
            if (current) {
              content.remove(current);
            }

            current = content.dom(errorRenderer, data);
          }
        } else {
          cover.node.classList.remove('loading-block__cover_visible');
          content.node.classList.remove('loading-block__content_dimmed');

          if (current) {
            content.remove(current);
          }

          current = content.dom(renderer, data);
        }
      }

      return {
        set,
        fetch(promise: Promise<T>) { // TODO Remove as unused
          set(null);

          promise.then(function (data) {
            set(data);
          }).catch(function (error) {
            if (error instanceof Error) {
              set(error);
            }
          });
        },
      };
    });
};
