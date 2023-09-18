import { ImageViewer } from "../viewers/image.js";

function getExtension (file) {
  var dotPos = file.lastIndexOf('.');

  if (dotPos > -1) {
    return file.substring(dotPos + 1);
  }

  return '';
}

const VIEWERS = {
  'png': ImageViewer,
  'svg': ImageViewer,
};

export function handleFile (file, host) {
  var extension = getExtension(file.name);

  if (extension in VIEWERS) {
    host.cover.set(VIEWERS[extension], file);
  }
};
