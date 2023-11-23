export type FileData = {
  name: string | null;
  type: 'directory' | 'file';
  size: number;
  atime: number;
  ctime: number;
  mtime: number;
  birthtime: number;
};
