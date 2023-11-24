import { Svg } from './svg';
import { Styles } from 'mbr-style';
import { host } from '../../common/host';

export const STYLE = {
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
  className?: string;
  points: string[];
  colors: {
    normal: string;
    hover: string;
  },
  width: number,
  height: number,
};

const REPLACING_RE = /[ ,.]/g;

export function createIcon ({ className, points, colors, width, height }: Params) {
  const svg = Svg.create({ width, height }, function (svg) {
    svg.set({ 'class': className });

    const defs = svg.add('defs', function (defs) {
      defs.add('filter', function (filter) {
        filter.set({ id: 'blur1' }).add('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '2' });
      });
      defs.add('filter', function (filter) {
        filter.set({ id: 'blur2' }).add('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '4' });
      });
    });

    for (let index = 0 ; index < points.length ; ++index) {
      const id = 'line-' + points[index].replace(REPLACING_RE, '_');

      defs.add('polyline', {
        id: id,
        points: points[index],
        'stroke-width': '2',
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      });

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
    node: svg,
    hover(value: boolean) {
      if (value) {
        svg.style.setProperty('--color', colors.hover);
        svg.style.setProperty('--blur', '1');
        svg.style.setProperty('--transition', '.2s');
      } else {
        svg.style.setProperty('--color', colors.normal);
        svg.style.setProperty('--blur', '0');
        svg.style.setProperty('--transition', '.6s');
      }
    },
  };

  ifc.hover(false);

  return ifc;
}

const ICON_PARAMS = {
  BACK: { points: ['17,2 5,11.5 17,22'], colors: ['#99f', '#224'], width: 24, height: 24 },
  FILE: { points: ['25,10 20,5 6,5 6,27 26,27 26,14 18,14 18,9'], colors: ['#eef', '#224'], width: 32, height: 32},
  FOLDER: { points: ['3,13 3,27 29,27 29,10 3,10 4,6 15,6 15.5,7'], colors: ['#99f', '#224'], width: 32, height: 32},
};

export type IconInterface = ReturnType<typeof createIcon>;

export const ICONS = Object.keys(ICON_PARAMS).reduce(function (result, key) {
  const params = ICON_PARAMS[key];

  result[key] = function (className) {
    return createIcon({
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

  return result;
}, {} as Record<keyof typeof ICON_PARAMS, (className: string) => IconInterface>);


host.styles.add('svg-icons-neon', STYLE);
