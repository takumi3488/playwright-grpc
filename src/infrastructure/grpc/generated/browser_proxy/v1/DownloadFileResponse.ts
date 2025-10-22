// Original file: proto/browser_proxy/browser_proxy.proto

import type { Long } from '@grpc/proto-loader';

export interface DownloadFileResponse {
  'data'?: (Buffer | Uint8Array | string);
  'totalSize'?: (number | string | Long);
}

export interface DownloadFileResponse__Output {
  'data': (Buffer);
  'totalSize': (string);
}
