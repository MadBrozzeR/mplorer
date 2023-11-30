import type { Splux } from 'splux';
import { Host, newComponent } from '../../common/host';
import { FileData } from '../../common/types';
import { tuneInState } from '../../common/utils';
import { ICONS, IconInterface } from '../svg/icon';

const STYLE = {
  '.toolbar': {
    height: 0,
    backgroundColor: '#113',
    lineHeight: '34px',
    padding: '0 8px',
    border: '1px solid #225',
    borderWidth: '1px 0',
    overflow: 'hidden',
    transition: '.2s height ease-in-out',
    display: 'flex',
    alignItems: 'center',

    '_active': {
      height: '36px',
    },

    '__button': {
      border: '1.5px solid #99f',
      borderRadius: '3px',
      boxSizing: 'border-box',
      height: '32px',
      width: '32px',
      backgroundColor: '#224',
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    '__button-icon': {
      width: '24px',
      height: '24px',
    },
  }
}

type ButtonParams = {
  action: () => void;
  icon: (className: string) => IconInterface;
};

const Button = newComponent('button', function (button, params: ButtonParams) {
  button.setParams({
    className: 'toolbar__button',
    onclick(event) {
      event.preventDefault();
      params.action.call(button);
    }
  });
  const icon = params.icon('toolbar__button-icon');

  button.dom(icon.node);
});

export const Toolbar = newComponent(function (toolbar) {
  toolbar.node.className = 'toolbar';
  const host = toolbar.host;
  host.styles.add('toolbar', STYLE);
  let route = host.state.get('route');

  function setButtons (files: Record<string, FileData>) {
    toolbar.clear();
    if (Object.keys(files).length === 1) {
      toolbar.dom(Button, {
        icon: ICONS.DOWNLOAD,
        action() {
          const file = Object.keys(files)[0];
          window.location.href = '/file/' + route.user + file;
        }
      });
    }
  }

  toolbar.tuneIn(tuneInState({
    route(routeState) {
      route = routeState;
    },
    selectedFiles: function (state) {
      const count = Object.keys(state).length;

      if (count) {
        toolbar.node.classList.add('toolbar_active');
        setButtons(state);
      } else {
        toolbar.node.classList.remove('toolbar_active');
      }
    }
  }));
});
