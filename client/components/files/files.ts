import { Splux } from 'splux';
import { handleFile } from './handlers';
import { Cast, Host, newComponent } from '../../common/host';
import type { FileData, SelectedFiles } from '../../common/types';
import { LoadingBlock } from '../loading/loading-block';
import { IconInterface, ICONS } from '../svg/icon';
import { requestForState, tuneInState } from '../../common/utils';
import type { RouterData } from '../../lib/router';

var STYLE = {
  '.files': {
    position: 'relative',
    flex: 1,
    overflow: 'hidden',

    '__loader-block': {
      height: '100%',
    },

    '__list': {
      height: '100%',
      overflow: 'auto',

      '::-webkit-scrollbar': {
        width: '10px',

        '-thumb': {
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          backgroundColor: '#99f',
          borderRadius: '5px',
        },
      },
    },
  },

  '.file': {
    height: '32px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '32px',
    transition: [
      '.6s text-shadow ease-in-out',
      '.6s color ease-in-out',
      '.5s background-color ease-out',
      '.5s border-color ease-out'
    ].join(','),
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: 'rgba(22, 22, 55, 0)',
    border: '1px solid rgba(77, 77, 238, 0)',
    marginBottom: '1px',

    ':hover': {
      // transform: 'translateX(4px)',
      textShadow: '0 0 2px darkorange, 0 0 4px white',
      color: '#224',
      transition: '.2s text-shadow ease-in-out, .2s color ease-in-out',

      ' .file__name': {
        transform: 'translateX(8px)',
        transition: '.2s transform ease-in-out',
      }
    },

    '_state_touch': {
      backgroundColor: 'rgba(22, 22, 55, 1)',
    },

    '_state_selected': {
      backgroundColor: 'rgba(22, 22, 55, 1)',
      borderColor: 'rgba(77, 77, 238, 1)',
    },

    '__icon': {
      width: '24px',
      transform: 'translateY(-2px)',
    },

    '__name': {
      display: 'inline-block',
      transition: '.6s transform ease-in-out',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      userSelect: 'none',
    },
  },

  '.file_type': {
    '_directory': {
      fontWeight: 900,
      cursor: 'pointer',
      color: '#99f',
    },
    '_file': {
      cursor: 'pointer',
      color: '#ccf',
    }
  },

  '@media (max-width: 640px)': {
    '.files__list': {
      padding: '0 8px 8px',
    },
  },
};

const TOUCH_TIMEOUT = 500;

type TouchActionType = 'hold' | 'touch' | 'press' | 'click' | 'move';
type TouchBehaviorAction = (
  this: Splux<HTMLDivElement, Host>,
  type: TouchActionType,
  file: FileData
) => void;

function attachTouch (
  elementSpl: Splux<HTMLDivElement, Host>,
  file: FileData,
  behavior: TouchBehaviorAction,
) {
  let timer: NodeJS.Timeout;
  let holdTriggered = false;
  let isMoved = false;

  elementSpl.setParams({
    ontouchstart(event) {
      behavior.call(elementSpl, 'press', file);
      holdTriggered = false;
      timer = setTimeout(function () {
        clearTimeout(timer);
        holdTriggered = true;
        behavior.call(elementSpl, 'hold', file);
      }, TOUCH_TIMEOUT);
    },
    /*
    ontouchend() {
      if (!holdTriggered && !isMoved) {
        clearTimeout(timer);
        behavior.call(elementSpl, 'touch', file);
      }
      isMoved = false;
    },
    */
    ontouchmove() {
      if (!holdTriggered) {
        clearTimeout(timer);
        isMoved = true;
        behavior.call(elementSpl, 'move', file);
      }
    },
    oncontextmenu(event) {
      event.preventDefault();
      behavior.call(elementSpl, 'hold', file);
    },
    onclick() {
      if (!holdTriggered && !isMoved) {
        clearTimeout(timer);
        behavior.call(elementSpl, 'touch', file);
        holdTriggered = false;
      }
      isMoved = false;
    }
  })
}

type FileIFC = {
  data: FileData;
  setState(state: 'selected' | 'touch' | 'none'): void;
  getState(): 'selected' | 'touch' | 'none';
};
type Params = {
  data: FileData;
  list: FileData[];
  onAction: (type: TouchActionType, file: FileIFC) => void;
};

const STATE_CLASS_MAP = {
  none: '',
  touch: 'file_state_touch',
  selected: 'file_state_selected',
};

const File = newComponent(function File (file, { data, list, onAction }: Params) {
  const host = file.host;
  let isSelected = false;
  let classModifier = '';
  const route = host.state.get('route');

  if (!data) {
    return;
  }
  let icon: IconInterface | null = null;

  file.setParams({
    className: 'file file_type_' + data.type,
    onmouseover() { icon?.hover(true); },
    onmouseout() { icon?.hover(false); },
  });

  switch (data.type) {
    case 'directory':
      icon = ICONS.FOLDER('file__icon');
      file.dom(icon.node);

      break;
    default:
      icon = ICONS.FILE('file__icon');
      file.dom(icon.node);
      break;
  }

  file.dom('span', { innerText: data.name, className: 'file__name' });

  const ifc: FileIFC = {
    data: data,
    setState(state) {
      if (STATE_CLASS_MAP[state] === classModifier) {
        return;
      }

      if (classModifier) {
        file.node.classList.remove(classModifier);
      }

      classModifier = STATE_CLASS_MAP[state] || STATE_CLASS_MAP.none;

      classModifier && file.node.classList.add(classModifier);
    },
    getState() {
      switch (classModifier) {
        case '':
          return 'none';
        case 'file_state_touch':
          return 'touch';
        case 'file_state_selected':
          return 'selected';
      }
    }
  };

  attachTouch(file, data, function (action) {
    onAction(action, ifc);
  });

  return ifc;
});

const FileList = newComponent(function FileList (list, payload: FileData[]) {
  list.setParams({ className: 'files__list' });
  const host = list.host;

  let selectedFiles: SelectedFiles = {};
  let selectedFilesNumber = 0;
  const path = host.state.get('route').path;
  const fileNodes: FileIFC[] = [];

  function selectFile (value: boolean, fileIfc: FileIFC) {
    const fileName = path + fileIfc.data.name;
    if (value) {
      host.state.assign(function (state) {
        const newState = { selectedFiles: { ...state.selectedFiles } };
        newState.selectedFiles[fileName] = fileIfc.data;

        return newState;
      });
    } else {
      host.state.assign(function (state) {
        const newState = { selectedFiles: { ...state.selectedFiles } };
        delete newState.selectedFiles[fileName];

        return newState;
      });
    }
  }

  list.tuneIn(tuneInState({ selectedFiles(files) {
    selectedFiles = files;
    selectedFilesNumber = Object.keys(selectedFiles).length;
    fileNodes.forEach(function (node) {
      node.setState((path + node.data.name) in files ? 'selected' : 'none');
    });
  } }));

  function handleAction (action: TouchActionType, fileIfc: FileIFC) {
    const isSelectionMode = selectedFilesNumber > 0;

    if ((path + fileIfc.data.name) in selectedFiles) {
      switch (action) {
        case 'touch':
          selectFile(false, fileIfc);
          fileIfc.setState('none');
          break;
      }
    } else {
      switch (action) {
        case 'touch':
          if (isSelectionMode) {
            selectFile(true, fileIfc);
          } else {
            fileIfc.setState('none');
            handleFile(fileIfc.data, payload, host);
          }
          break;
        case 'move':
          fileIfc.setState('none');
          break;
        case 'press':
          fileIfc.setState('touch');
          break;
        case 'hold':
          selectFile(true, fileIfc)
          break;
      }
    }
  }

  for (var index = 0 ; index < payload.length ; ++index) {
    fileNodes.push(list.dom(File, {
      data: payload[index],
      list: payload,
      onAction: handleAction,
    }));
  }
});

var ORDER = {
  back: 1,
  directory: 2,
  file: 3,
};

const ErrorBlock = newComponent((block, error: Error) => {
  block.setParams({ innerText: error.message });
});

async function fetchFiles (path: string) {
  const response = await fetch('/fs/' + path);

  if (!response.ok) {
    throw new Error('Response returned with status ' + response.status);
  }

  const payload: FileData[] = await response.json();

  return payload.sort(function (file1, file2) {
    return ORDER[file1.type] - ORDER[file2.type];
  });
}

export const Files = newComponent(function Files (files) {
  const host = files.host;
  host.styles.add('files', STYLE);
  files.setParams({ className: 'files' });
  const route = host.state.get('route');

  function requestFiles (route: RouterData) {
    requestForState(fetchFiles(route.user + route.path), function (update) {
      host.state.assign(function (state) {
        return {
          files: { ...state.files, ...update },
        }
      });
    });
  }

  const loader = files.dom(LoadingBlock(FileList, ErrorBlock), { className: 'files__loader-block' });

  files.tuneIn(tuneInState({
    route: function (route) {
      requestFiles(route);
    },
    files: function (particle) {
      switch (particle.status) {
        case 'failed':
          loader.set(new Error(particle.error));
          break;
        case 'success':
          host.state.reset('selectedFiles');
          loader.set(particle.data);
          break;
        default:
          loader.set(null);
          break;
      }
    },
  }));
});
