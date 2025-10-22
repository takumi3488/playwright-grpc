// Original file: proto/browser_proxy/browser_proxy.proto


export interface DownloadFileRequest {
  'sessionId'?: (string);
  'url'?: (string);
  'headers'?: ({[key: string]: string});
}

export interface DownloadFileRequest__Output {
  'sessionId': (string);
  'url': (string);
  'headers': ({[key: string]: string});
}
