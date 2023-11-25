type RootParams = {
  width: number;
  height: number;
}

type TagNames = SVGElementTagNameMap;

type ParamsAsObj = Record<string, string>;
type ParamsAsFunc<N extends SVGElement, I> = (node: Svg<N>) => I;
type Either<A, B> = A extends void | undefined ? B : A;

export class Svg<N extends SVGElement> {
  node: N;

  constructor(node: N) {
    this.node = node;
  }

  static create<I = void>(
    { width, height }: RootParams,
    params: ParamsAsFunc<SVGSVGElement, I>
  ): Either<I, Svg<SVGSVGElement>> {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('viewBox', `0 0 ${width} ${height}`);
    node.setAttribute('width', width.toString());
    node.setAttribute('height', height.toString());

    const svg = new Svg(node);
    const ifc = params(svg);

    return (ifc === undefined ? svg : ifc) as any;
  };

  set(params: ParamsAsObj) {
    for (const key in params) {
      this.node.setAttribute(key, params[key]);
    }

    return this;
  }

  add<K extends keyof TagNames, I = void>(
    tag: K,
    params?: ParamsAsObj | ParamsAsFunc<TagNames[K], I>
  ): Either<I, Svg<TagNames[K]>> {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    let result: I | undefined = undefined;

    this.node.appendChild(node);

    const svg = new Svg(node);

    if (params instanceof Function) {
      result = params(svg);
    } else if (params.constructor === Object) {
      svg.set(params);
    }

    return (result === undefined ? svg : result) as any;
  };
}
