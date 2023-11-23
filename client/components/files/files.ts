import { bem } from '../../lib/bem';
import { handleFile } from './handlers';
import { newComponent } from '../../common/host';
import { FileData } from '../../common/types';
import { createFolderIcon } from '../svg/folder';
import { createFileIcon } from '../svg/file';

var FLOATER = {
  display: 'block',
  content: '""',
  position: 'absolute',
  width: '10px',
  height: '10px',
  border: '1px solid black',
  transform: 'translate(50%, -50%)',
  backgroundColor: '#ccc',
  opacity: 0,
  transition: '0.4s opacity ease-in-out',
};

var STYLE = {
  '@keyframes loading1': {
    '0%': { top: '5%', right: '5%' },
    '50%': { top: '5%', right: '95%' },
    '100%': { top: '95%', right: '95%' },
  },
  '@keyframes loading2': {
    '0%': { top: '95%', right: '95%' },
    '50%': { top: '95%', right: '5%' },
    '100%': { top: '5%', right: '5%' },
  },

  '.files': {
    position: 'relative',
    flex: 1,
    overflow: 'auto',
    paddingTop: '8px',

    ':before': {
      ...FLOATER,
      animation: '1s loading1 ease-in-out infinite',
    },

    ':after': {
      ...FLOATER,
      animation: '1s loading2 ease-in-out infinite',
    },

    '_loading': {
      ':before': {
        opacity: 1,
      },
      ':after': {
        opacity: 1,
      }
    },

    '::-webkit-scrollbar': {
      width: '10px',

      '-track': {
      },

      '-thumb': {
        border: '2px solid transparent',
        backgroundClip: 'padding-box',
        backgroundColor: '#99f',
        borderRadius: '5px',
      },
    },
  },

  '.file': {
    height: '32px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '32px',
    transition: '.6s text-shadow ease-in-out, .6s color ease-in-out',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',

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
    },
  },

  '.file_type': {
    '_directory': {
      fontWeight: 900,
      cursor: 'pointer',
      color: '#99f',
    },
    '_back': {
      fontWeight: 900,
      cursor: 'pointer',
    }
  },

  '@media (max-width: 640px)': {
    '.files': {
      padding: '0 8px 8px',
    },
  },
};

type Params = {
  data: FileData;
  list: FileData[];
};

const File = newComponent(function File (file, { data, list }: Params) {
  const host = this.host;

  if (data) {
    let icon: ReturnType<typeof createFolderIcon> | null = null;

    this.setParams({
      className: 'file file_type_' + data.type,
      onmouseover() { icon?.hover(true); },
      onmouseout() { icon?.hover(false); },
    });

    switch (data.type) {
      case 'directory':
        file.onclick = function () {
          host.router.push(data.name);
        }

        icon = createFolderIcon({ className: 'file__icon' });
        this.dom(icon.node);
        break;
      default:
        file.onclick = function () {
          handleFile(data, list, host);
        }
        icon = createFileIcon({ className: 'file__icon' });
        this.dom(icon.node);
    }

    this.dom('span', { innerText: data.name, className: 'file__name' });
  }
});

var ORDER = {
  back: 1,
  directory: 2,
  file: 3,
};

export const Files = newComponent(function Files (files) {
  const block = this;
  const cn = bem('files');

  this.host.styles.add('files', STYLE);
  files.className = cn();

  this.host.state.route.listen(async function (route) {
    files.innerText = '';
    files.className = cn('', { loading: true });

    try {
      var response = await fetch('/fs/' + route.user + route.path);

      if (!response.ok) {
        throw new Error(
          'Response returned with status ' + response.status
        );
      }

      const payload: FileData[] = await response.json();

      payload.sort(function (file1, file2) {
        return ORDER[file1.type] - ORDER[file2.type];
      });

      for (var index = 0 ; index < payload.length ; ++index) {
        block.dom(File, { data: payload[index], list: payload });
      }
    } catch (error) {
      console.log(error);
    } finally {
      files.className = cn();
    }
  });
});
