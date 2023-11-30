export type FileData = {
  name: string | null;
  type: 'directory' | 'file';
  size: number;
  atime: number;
  ctime: number;
  mtime: number;
  birthtime: number;
};

export type Particle<D> = {
  status: 'initial' | 'success' | 'failed' | 'pending';
  data: D | null;
  error: string;
};

export type Broadcast<T extends string, D> = { type: T, data: D };

export type SelectedFiles = Record<string, FileData>;
