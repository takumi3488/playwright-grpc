// Original file: proto/browser_proxy/v1/browser_proxy.proto

import type { Cookie as _browser_proxy_v1_Cookie, Cookie__Output as _browser_proxy_v1_Cookie__Output } from '../../browser_proxy/v1/Cookie';

export interface CreateSessionRequest {
  'cookies'?: (_browser_proxy_v1_Cookie)[];
  'defaultHeaders'?: ({[key: string]: string});
}

export interface CreateSessionRequest__Output {
  'cookies': (_browser_proxy_v1_Cookie__Output)[];
  'defaultHeaders': ({[key: string]: string});
}
