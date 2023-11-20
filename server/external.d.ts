declare module 'mbr-zip' {
  interface CD {
    versionMadeBy: number;
    versionToExtract: number;
    purposeBitFlag: number;
    method: number;
    modTime: number;
    modDate: number;
    crc32: Buffer;
    compressedSize: number;
    uncompressedSize: number;
    nameLen: number;
    extraLen: number;
    commentLen: number;
    disk: number;
    attributes: number;
    extAttributes: number;
    offset: number;
    name: string;
    extra: string;
    comment: string;
  }

  interface LocalHeader {
    versionToExtract: number;
    purposeBitFlag: number;
    method: number;
    modTime: number;
    modDate: number;
    crc32: Buffer;
    compressedSize: number;
    uncompressedSize: number;
    name: string;
    extra: string;
    offset: number;
  }

  class Record {
    header: CD;
    LocalHeader?: LocalHeader;
    data?: Buffer;
    zip: MBRZip;

    getLocalHeader(): LocalHeader;
    getData(): Buffer;
    extract(callback: (error: Error | null, data: Buffer) => void): void;
  }

  class MBRZip {
    constructor(data: Buffer);
    iterate(callback: (this: MBRZip, name: string, record: Record) => void): MBRZip;
  }
}

