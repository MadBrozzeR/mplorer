import type { Component } from 'splux';
import type { Host } from '../../common/host';
import type { FileData } from '../../common/types';
import { ImageViewer, IMAGE_SUPPORT } from "../viewers/image";
import { Viewer } from './types';

function getExtension (file: string | null) {
  var dotPos = file && file.lastIndexOf('.');

  if (dotPos > -1) {
    return file.substring(dotPos + 1);
  }

  return '';
}

function register<K extends string, N extends string>(extensions: Record<K, boolean>, viewer: Viewer<N>) {
  var result = {} as Record<K, Viewer<N>>;

  for (var extension in extensions) {
    result[extension] = viewer;
  }

  return result;
}

const VIEWERS = {
  ...register(IMAGE_SUPPORT, ImageViewer),
};

export function handleFile (file: FileData, list: FileData[], host: Host) {
  var extension = getExtension(file.name);

  if (extension in VIEWERS) {
    host.cover.set(VIEWERS[extension], { file, list });
  }
};
