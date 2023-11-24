type RootParams = {
  width: number;
  height: number;
}

type TagNames = SVGElementTagNameMap;

type ParamsAsObj = Record<string, string>;
type ParamsAsFunc<N extends SVGElement> = (node: Svg<N>) => void;

export class Svg<N extends SVGElement> {
  node: N;

  constructor(node: N) {
    this.node = node;
  }

  static create({ width, height }: RootParams, params: ParamsAsFunc<SVGSVGElement>) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('viewBox', `0 0 ${width} ${height}`);
    node.setAttribute('width', width.toString());
    node.setAttribute('height', height.toString());

    params(new Svg(node));

    return node;
  }

  set(params: ParamsAsObj) {
    for (const key in params) {
      this.node.setAttribute(key, params[key]);
    }

    return this;
  }

  add<K extends keyof TagNames>(tag: K, params: ParamsAsObj | ParamsAsFunc<TagNames[K]>) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);

    this.node.appendChild(node);

    const svg = new Svg(node);

    if (params instanceof Function) {
      params(svg);
    } else {
      svg.set(params);
    }

    return svg;
  };
}
