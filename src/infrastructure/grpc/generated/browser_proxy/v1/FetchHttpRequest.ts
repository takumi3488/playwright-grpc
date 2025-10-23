// Original file: proto/browser_proxy/v1/browser_proxy.proto


export interface FetchHttpRequest {
  'sessionId'?: (string);
  'url'?: (string);
  'headers'?: ({[key: string]: string});
}

export interface FetchHttpRequest__Output {
  'sessionId': (string);
  'url': (string);
  'headers': ({[key: string]: string});
}
