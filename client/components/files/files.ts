import { handleFile } from './handlers';
import { newComponent } from '../../common/host';
import { FileData } from '../../common/types';
import { createFolderIcon } from '../svg/folder';
import { createFileIcon } from '../svg/file';
import { LoadingBlock } from '../loading/loading-block';

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
    transition: '.6s text-shadow ease-in-out, .6s color ease-in-out',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    WebkitTapHighlightColor: 'transparent',

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
    '.files__list': {
      padding: '0 8px 8px',
    },
  },
};

type Params = {
  data: FileData;
  list: FileData[];
};

const File = newComponent(function File (file, { data, list }: Params) {
  const host = file.host;

  if (!data) {
    return;
  }
  let icon: ReturnType<typeof createFolderIcon> | null = null;

  file.setParams({
    className: 'file file_type_' + data.type,
    onmouseover() { icon?.hover(true); },
    onmouseout() { icon?.hover(false); },
  });

  switch (data.type) {
    case 'directory':
      file.setParams({ onclick() {
        host.router.push(data.name);
      } });

      icon = createFolderIcon({ className: 'file__icon' });
      file.dom(icon.node);

      break;
    default:
      file.setParams({ onclick() {
        handleFile(data, list, host);
      } })
      icon = createFileIcon({ className: 'file__icon' });
      file.dom(icon.node);
  }

  file.dom('span', { innerText: data.name, className: 'file__name' });
});

const FileList = newComponent(function FileList (list, payload: FileData[]) {
  list.setParams({ className: 'files__list' });

  for (var index = 0 ; index < payload.length ; ++index) {
    list.dom(File, { data: payload[index], list: payload });
  }
});

var ORDER = {
  back: 1,
  directory: 2,
  file: 3,
};

const ErrorBlock = newComponent((block, error: Error) => {
  debugger;
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
  files.host.styles.add('files', STYLE);
  files.setParams({ className: 'files' });

  const loader = files.dom(LoadingBlock(FileList, ErrorBlock), { className: 'files__loader-block' });

  files.host.state.route.listen(function (route) {
    loader.fetch(fetchFiles(route.user + route.path));
  });
});
