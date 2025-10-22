// Original file: proto/browser_proxy/browser_proxy.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CloseSessionRequest as _browser_proxy_v1_CloseSessionRequest, CloseSessionRequest__Output as _browser_proxy_v1_CloseSessionRequest__Output } from '../../browser_proxy/v1/CloseSessionRequest';
import type { CloseSessionResponse as _browser_proxy_v1_CloseSessionResponse, CloseSessionResponse__Output as _browser_proxy_v1_CloseSessionResponse__Output } from '../../browser_proxy/v1/CloseSessionResponse';
import type { CreateSessionRequest as _browser_proxy_v1_CreateSessionRequest, CreateSessionRequest__Output as _browser_proxy_v1_CreateSessionRequest__Output } from '../../browser_proxy/v1/CreateSessionRequest';
import type { CreateSessionResponse as _browser_proxy_v1_CreateSessionResponse, CreateSessionResponse__Output as _browser_proxy_v1_CreateSessionResponse__Output } from '../../browser_proxy/v1/CreateSessionResponse';
import type { DownloadFileRequest as _browser_proxy_v1_DownloadFileRequest, DownloadFileRequest__Output as _browser_proxy_v1_DownloadFileRequest__Output } from '../../browser_proxy/v1/DownloadFileRequest';
import type { DownloadFileResponse as _browser_proxy_v1_DownloadFileResponse, DownloadFileResponse__Output as _browser_proxy_v1_DownloadFileResponse__Output } from '../../browser_proxy/v1/DownloadFileResponse';
import type { FetchHttpRequest as _browser_proxy_v1_FetchHttpRequest, FetchHttpRequest__Output as _browser_proxy_v1_FetchHttpRequest__Output } from '../../browser_proxy/v1/FetchHttpRequest';
import type { FetchHttpResponse as _browser_proxy_v1_FetchHttpResponse, FetchHttpResponse__Output as _browser_proxy_v1_FetchHttpResponse__Output } from '../../browser_proxy/v1/FetchHttpResponse';
import type { NavigatePageRequest as _browser_proxy_v1_NavigatePageRequest, NavigatePageRequest__Output as _browser_proxy_v1_NavigatePageRequest__Output } from '../../browser_proxy/v1/NavigatePageRequest';
import type { NavigatePageResponse as _browser_proxy_v1_NavigatePageResponse, NavigatePageResponse__Output as _browser_proxy_v1_NavigatePageResponse__Output } from '../../browser_proxy/v1/NavigatePageResponse';

export interface BrowserProxyServiceClient extends grpc.Client {
  CloseSession(argument: _browser_proxy_v1_CloseSessionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  CloseSession(argument: _browser_proxy_v1_CloseSessionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  CloseSession(argument: _browser_proxy_v1_CloseSessionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  CloseSession(argument: _browser_proxy_v1_CloseSessionRequest, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  closeSession(argument: _browser_proxy_v1_CloseSessionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  closeSession(argument: _browser_proxy_v1_CloseSessionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  closeSession(argument: _browser_proxy_v1_CloseSessionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  closeSession(argument: _browser_proxy_v1_CloseSessionRequest, callback: grpc.requestCallback<_browser_proxy_v1_CloseSessionResponse__Output>): grpc.ClientUnaryCall;
  
  CreateSession(argument: _browser_proxy_v1_CreateSessionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  CreateSession(argument: _browser_proxy_v1_CreateSessionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  CreateSession(argument: _browser_proxy_v1_CreateSessionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  CreateSession(argument: _browser_proxy_v1_CreateSessionRequest, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  createSession(argument: _browser_proxy_v1_CreateSessionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  createSession(argument: _browser_proxy_v1_CreateSessionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  createSession(argument: _browser_proxy_v1_CreateSessionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  createSession(argument: _browser_proxy_v1_CreateSessionRequest, callback: grpc.requestCallback<_browser_proxy_v1_CreateSessionResponse__Output>): grpc.ClientUnaryCall;
  
  DownloadFile(argument: _browser_proxy_v1_DownloadFileRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_browser_proxy_v1_DownloadFileResponse__Output>;
  DownloadFile(argument: _browser_proxy_v1_DownloadFileRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_browser_proxy_v1_DownloadFileResponse__Output>;
  downloadFile(argument: _browser_proxy_v1_DownloadFileRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_browser_proxy_v1_DownloadFileResponse__Output>;
  downloadFile(argument: _browser_proxy_v1_DownloadFileRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_browser_proxy_v1_DownloadFileResponse__Output>;
  
  FetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  FetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  FetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  FetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  fetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  fetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  fetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  fetchHttp(argument: _browser_proxy_v1_FetchHttpRequest, callback: grpc.requestCallback<_browser_proxy_v1_FetchHttpResponse__Output>): grpc.ClientUnaryCall;
  
  NavigatePage(argument: _browser_proxy_v1_NavigatePageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  NavigatePage(argument: _browser_proxy_v1_NavigatePageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  NavigatePage(argument: _browser_proxy_v1_NavigatePageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  NavigatePage(argument: _browser_proxy_v1_NavigatePageRequest, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  navigatePage(argument: _browser_proxy_v1_NavigatePageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  navigatePage(argument: _browser_proxy_v1_NavigatePageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  navigatePage(argument: _browser_proxy_v1_NavigatePageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  navigatePage(argument: _browser_proxy_v1_NavigatePageRequest, callback: grpc.requestCallback<_browser_proxy_v1_NavigatePageResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface BrowserProxyServiceHandlers extends grpc.UntypedServiceImplementation {
  CloseSession: grpc.handleUnaryCall<_browser_proxy_v1_CloseSessionRequest__Output, _browser_proxy_v1_CloseSessionResponse>;
  
  CreateSession: grpc.handleUnaryCall<_browser_proxy_v1_CreateSessionRequest__Output, _browser_proxy_v1_CreateSessionResponse>;
  
  DownloadFile: grpc.handleServerStreamingCall<_browser_proxy_v1_DownloadFileRequest__Output, _browser_proxy_v1_DownloadFileResponse>;
  
  FetchHttp: grpc.handleUnaryCall<_browser_proxy_v1_FetchHttpRequest__Output, _browser_proxy_v1_FetchHttpResponse>;
  
  NavigatePage: grpc.handleUnaryCall<_browser_proxy_v1_NavigatePageRequest__Output, _browser_proxy_v1_NavigatePageResponse>;
  
}

export interface BrowserProxyServiceDefinition extends grpc.ServiceDefinition {
  CloseSession: MethodDefinition<_browser_proxy_v1_CloseSessionRequest, _browser_proxy_v1_CloseSessionResponse, _browser_proxy_v1_CloseSessionRequest__Output, _browser_proxy_v1_CloseSessionResponse__Output>
  CreateSession: MethodDefinition<_browser_proxy_v1_CreateSessionRequest, _browser_proxy_v1_CreateSessionResponse, _browser_proxy_v1_CreateSessionRequest__Output, _browser_proxy_v1_CreateSessionResponse__Output>
  DownloadFile: MethodDefinition<_browser_proxy_v1_DownloadFileRequest, _browser_proxy_v1_DownloadFileResponse, _browser_proxy_v1_DownloadFileRequest__Output, _browser_proxy_v1_DownloadFileResponse__Output>
  FetchHttp: MethodDefinition<_browser_proxy_v1_FetchHttpRequest, _browser_proxy_v1_FetchHttpResponse, _browser_proxy_v1_FetchHttpRequest__Output, _browser_proxy_v1_FetchHttpResponse__Output>
  NavigatePage: MethodDefinition<_browser_proxy_v1_NavigatePageRequest, _browser_proxy_v1_NavigatePageResponse, _browser_proxy_v1_NavigatePageRequest__Output, _browser_proxy_v1_NavigatePageResponse__Output>
}
