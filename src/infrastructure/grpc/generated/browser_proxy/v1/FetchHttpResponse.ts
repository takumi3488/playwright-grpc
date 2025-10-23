// Original file: proto/browser_proxy/v1/browser_proxy.proto


export interface FetchHttpResponse {
  'statusCode'?: (number);
  'headers'?: ({[key: string]: string});
  'body'?: (Buffer | Uint8Array | string);
}

export interface FetchHttpResponse__Output {
  'statusCode': (number);
  'headers': ({[key: string]: string});
  'body': (Buffer);
}
