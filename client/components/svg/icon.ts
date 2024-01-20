import { Svg } from './svg';
import { Styles } from 'mbr-style';
import { host } from '../../common/host';

const STYLE = {
  '.svg-icon-common-defs': {
    display: 'none',
  },

  '.svg-icon': {
    '__icon': {
      transition: 'var(--transition, .6s) all ease-in-out',
      stroke: 'var(--color, #99f)',
    },
    '__blur': {
      transition: 'var(--transition, .6s) all ease-in-out',
      opacity: 'var(--blur, 0)',
    }
  },
};

type Params = {
  id: string;
  className?: string;
  points: string[];
  colors: {
    normal: string;
    hover: string;
  },
  width: number,
  height: number,
};

function createIcon ({id, className, points, colors, width, height }: Params) {
  const svg = Svg.create({ width, height }, function (svg) {
    svg.set({ 'class': className });

    for (let index = 0 ; index < points.length ; ++index) {
      svg.add('g', function (group) {
        group.set({ 'class': 'svg-icon__blur' });
        group.add('use', {
          href: '#' + id,
          stroke: 'white',
          filter: 'url(#blur1)',
        });
        group.add('use', {
          href: '#' + id,
          stroke: 'darkorange',
          filter: 'url(#blur2)',
        });
      });

      svg.add('use', {
        href: '#' + id,
        'class': 'svg-icon__icon',
      });
    }
  });

  const ifc = {
    node: svg.node,
    hover(value: boolean) {
      if (value) {
        svg.node.style.setProperty('--color', colors.hover);
        svg.node.style.setProperty('--blur', '1');
        svg.node.style.setProperty('--transition', '.2s');
      } else {
        svg.node.style.setProperty('--color', colors.normal);
        svg.node.style.setProperty('--blur', '0');
        svg.node.style.setProperty('--transition', '.6s');
      }
    },
  };

  ifc.hover(false);

  return ifc;
}

const ICON_PARAMS = {
  BACK: { id: 'back', points: ['17,2 5,11.5 17,22'], colors: ['#99f', '#224'], width: 24, height: 24 },
  FILE: { id: 'file', points: ['25,10 20,5 6,5 6,27 26,27 26,14 18,14 18,9'], colors: ['#eef', '#224'], width: 32, height: 32},
  FOLDER: { id: 'folder', points: ['3,13 3,27 29,27 29,10 3,10 4,6 15,6 15.5,7'], colors: ['#99f', '#224'], width: 32, height: 32},
  DOWNLOAD: { id: 'download', points: ['8,19 3,19 3,8 8,8 8,4 24,4 24,8 29,8 29,19 22,19 22,13 11,13 11,23 7,23 16.5,30 26,23 22,23 22,22'], colors: ['#99f', '#224'], width: 32, height: 32},
  CROSS: { id: 'cross', points: ['2,4 14,16 2,28 4,30 16,18 29,30 31,28 18,16 31,4 29,2 16,14 4,2'], colors: ['#99f', '#224'], width: 32, height: 32},
};

export type IconInterface = ReturnType<typeof createIcon>;

export function injectStyles(styles: Styles) {
  styles.add('svg-icons-neon', STYLE);
};

export const CommonDefs = Svg.create({ width: 0, height: 0}, function (svg) {
  const shapes: Record<string, string> = {};
  let nextIndex = 1;

  svg.set({ 'class': 'svg-icon-common-defs' });

  const defs = svg.add('defs', function (defs) {
    defs.add('filter', function (filter) {
      filter.set({ id: 'blur1' }).add('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '2' });
    });
    defs.add('filter', function (filter) {
      filter.set({ id: 'blur2' }).add('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '4' });
    });
  });

  return {
    svg: svg.node,
    pushShape(points: string) {
      if (!shapes[points]) {
        shapes[points] = 'line-' + nextIndex++;

        defs.add('polyline', {
          id: shapes[points],
          points: points,
          'stroke-width': '2',
          fill: 'none',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        });
      }

      return shapes[points];
    }
  };
});

function isIconParamKey(key: string): key is keyof typeof ICON_PARAMS {
  return key in ICON_PARAMS;
}

export const ICONS = Object.keys(ICON_PARAMS).reduce(function (result, key) {
  if (isIconParamKey(key)) {
    const params = ICON_PARAMS[key];
    const id = params.id;

    params.points.forEach(function (points) {
      CommonDefs.pushShape(points);
    });

    result[key] = function (className: string) {
      return createIcon({
        id: id,
        className: className,
        points: params.points,
        width: params.width,
        height: params.height,
        colors: {
          normal: params.colors[0],
          hover: params.colors[1],
        },
      })
    }
  }

  return result;
}, {} as Record<keyof typeof ICON_PARAMS, (className: string) => IconInterface>);
