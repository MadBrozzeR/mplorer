import ts from 'typescript';
import * as fs from 'fs/promises';
import { ScriptTarget } from 'typescript';

const MODULE_REPLACEMENT = {
  splux: '/src/splux.js',
  'mbr-style': '/src/mbr-style.js',
  'mbr-state': '/src/mbr-state.js',
};

export async function transpileFile (file: Buffer) {
  const transpiled = ts.transpileModule(file.toString(), {
    compilerOptions: {
      target: ScriptTarget.ESNext,
    },
  });

  return transpiled.outputText;
}

const MODULE_IMPORT_RE = /(^|\n)import (.+) from '(.+)';/g;

export function replaceModules (source: string, replacements: Record<string, string>) {
  return source.replace(MODULE_IMPORT_RE, function (source, prefix, imports, moduleName) {
    return moduleName in replacements
      ? prefix + 'import ' + imports + ' from \'' + replacements[moduleName] + '\';'
      : source;
  });
}

export async function readTSFile (file: Buffer) {
  return replaceModules(await transpileFile(file), MODULE_REPLACEMENT);
}
