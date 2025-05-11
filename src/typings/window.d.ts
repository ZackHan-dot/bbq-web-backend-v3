declare global {
  interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
    browserLanguage: string;
  }
  interface Window {
    LakeCodeMirror: any;
    katex: any;
  }
}

export {};
