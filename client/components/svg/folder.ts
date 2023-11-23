import { Svg } from './svg';
import { Styles } from 'mbr-style';

const STYLE = {
  '.icon': {
    transition: 'var(--transition, .6s) all ease-in-out',
    stroke: 'var(--color, #99f)',
  },
  '.blur': {
    transition: 'var(--transition, .6s) all ease-in-out',
    opacity: 'var(--blur, 0)',
  }
};

const POLYLINE_PARAMS = {
  'points': '3,13 3,27 29,27 29,10 3,10 4,6 15,6 15.5,7',
  'stroke-width': '2',
  'fill': 'none',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

type Params = { className?: string };

export function createFolderIcon ({ className }: Params) {
  const styles = new Styles();

  const svg = Svg.create({ width: 32, height: 32 }, function (svg) {
    styles.add('root', STYLE);

    svg.set({ 'class': className });

    svg.add('defs', function (defs) {
      defs.add('style', function (style) {
        styles.target = style.node as unknown as HTMLStyleElement;
      });

      defs.add('filter', function (filter) {
        filter.set({ id: 'blur1' }).add('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '2' });
      });
      defs.add('filter', function (filter) {
        filter.set({ id: 'blur2' }).add('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '4' });
      });
    });

    svg.add('g', function (group) {
      group.set({ 'class': 'blur' });
      group.add('polyline', {
        ...POLYLINE_PARAMS,
        stroke: 'white',
        filter: 'url(#blur1)',
      });
      group.add('polyline', {
        ...POLYLINE_PARAMS,
        stroke: 'darkorange',
        filter: 'url(#blur2)',
      });
    });

    svg.add('polyline', {
      ...POLYLINE_PARAMS,
      'class': 'icon',
    });
  });

  const ifc = {
    node: svg,
    hover(value: boolean) {
      if (value) {
        svg.style.setProperty('--color', '#224');
        svg.style.setProperty('--blur', '1');
        svg.style.setProperty('--transition', '.2s');
      } else {
        svg.style.setProperty('--color', '#99f');
        svg.style.setProperty('--blur', '0');
        svg.style.setProperty('--transition', '.6s');
      }
    },
  }

  ifc.hover(false);

  return ifc;
}
