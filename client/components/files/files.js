import { bem } from '/src/lib/styles.js';
import { handleFile } from './handlers.js';

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
    }
  },

  '.file': {
    height: '32px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '32px',
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
  }
};

function File (file, { data, list }) {
  const host = this.host;

  if (data) {
    file.innerText = data.name;
    file.className = 'file file_type_' + data.type;

    switch (data.type) {
      case 'directory':
        file.onclick = function () {
          host.router.push(data.name);
        }
        break;
      default:
        file.onclick = function () {
          handleFile(data, list, host);
        }
    }
  }
}
File.tag = 'div';

var ORDER = {
  back: 1,
  directory: 2,
  file: 3,
};

export function Files (files) {
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

      const payload = await response.json();

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
};
Files.tag = 'div';
