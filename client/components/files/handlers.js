import { ImageViewer, IMAGE_SUPPORT } from "../viewers/image.js";

function getExtension (file) {
  var dotPos = file.lastIndexOf('.');

  if (dotPos > -1) {
    return file.substring(dotPos + 1);
  }

  return '';
}

function register (extensions, viewer) {
  var result = {};

  for (var extension in extensions) {
    result[extension] = viewer;
  }

  return result;
}

const VIEWERS = {
  ...register(IMAGE_SUPPORT, ImageViewer),
};

export function handleFile (file, list, host) {
  var extension = getExtension(file.name);

  if (extension in VIEWERS) {
    host.cover.set(VIEWERS[extension], { file, list });
  }
};
