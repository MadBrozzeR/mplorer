import { Component } from 'splux';
import { Host } from '../../common/host';
import { FileData } from '../../common/types';

export type Params = {
  file: FileData;
  list: FileData[];
};

export type Viewer<N extends string> = Component<'div', Host, void, Params> & { type: N };
