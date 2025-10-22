import type * as grpc from "@grpc/grpc-js";
import type { MessageTypeDefinition } from "@grpc/proto-loader";

import type {
	BrowserProxyServiceClient as _browser_proxy_v1_BrowserProxyServiceClient,
	BrowserProxyServiceDefinition as _browser_proxy_v1_BrowserProxyServiceDefinition,
} from "./browser_proxy/v1/BrowserProxyService";
import type {
	CloseSessionRequest as _browser_proxy_v1_CloseSessionRequest,
	CloseSessionRequest__Output as _browser_proxy_v1_CloseSessionRequest__Output,
} from "./browser_proxy/v1/CloseSessionRequest";
import type {
	CloseSessionResponse as _browser_proxy_v1_CloseSessionResponse,
	CloseSessionResponse__Output as _browser_proxy_v1_CloseSessionResponse__Output,
} from "./browser_proxy/v1/CloseSessionResponse";
import type {
	CreateSessionRequest as _browser_proxy_v1_CreateSessionRequest,
	CreateSessionRequest__Output as _browser_proxy_v1_CreateSessionRequest__Output,
} from "./browser_proxy/v1/CreateSessionRequest";
import type {
	CreateSessionResponse as _browser_proxy_v1_CreateSessionResponse,
	CreateSessionResponse__Output as _browser_proxy_v1_CreateSessionResponse__Output,
} from "./browser_proxy/v1/CreateSessionResponse";
import type {
	DownloadFileRequest as _browser_proxy_v1_DownloadFileRequest,
	DownloadFileRequest__Output as _browser_proxy_v1_DownloadFileRequest__Output,
} from "./browser_proxy/v1/DownloadFileRequest";
import type {
	DownloadFileResponse as _browser_proxy_v1_DownloadFileResponse,
	DownloadFileResponse__Output as _browser_proxy_v1_DownloadFileResponse__Output,
} from "./browser_proxy/v1/DownloadFileResponse";
import type {
	FetchHttpRequest as _browser_proxy_v1_FetchHttpRequest,
	FetchHttpRequest__Output as _browser_proxy_v1_FetchHttpRequest__Output,
} from "./browser_proxy/v1/FetchHttpRequest";
import type {
	FetchHttpResponse as _browser_proxy_v1_FetchHttpResponse,
	FetchHttpResponse__Output as _browser_proxy_v1_FetchHttpResponse__Output,
} from "./browser_proxy/v1/FetchHttpResponse";
import type {
	NavigatePageRequest as _browser_proxy_v1_NavigatePageRequest,
	NavigatePageRequest__Output as _browser_proxy_v1_NavigatePageRequest__Output,
} from "./browser_proxy/v1/NavigatePageRequest";
import type {
	NavigatePageResponse as _browser_proxy_v1_NavigatePageResponse,
	NavigatePageResponse__Output as _browser_proxy_v1_NavigatePageResponse__Output,
} from "./browser_proxy/v1/NavigatePageResponse";

type SubtypeConstructor<
	Constructor extends new (
		...args: any
	) => any,
	Subtype,
> = {
	new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
	browser_proxy: {
		v1: {
			BrowserProxyService: SubtypeConstructor<
				typeof grpc.Client,
				_browser_proxy_v1_BrowserProxyServiceClient
			> & { service: _browser_proxy_v1_BrowserProxyServiceDefinition };
			CloseSessionRequest: MessageTypeDefinition<
				_browser_proxy_v1_CloseSessionRequest,
				_browser_proxy_v1_CloseSessionRequest__Output
			>;
			CloseSessionResponse: MessageTypeDefinition<
				_browser_proxy_v1_CloseSessionResponse,
				_browser_proxy_v1_CloseSessionResponse__Output
			>;
			CreateSessionRequest: MessageTypeDefinition<
				_browser_proxy_v1_CreateSessionRequest,
				_browser_proxy_v1_CreateSessionRequest__Output
			>;
			CreateSessionResponse: MessageTypeDefinition<
				_browser_proxy_v1_CreateSessionResponse,
				_browser_proxy_v1_CreateSessionResponse__Output
			>;
			DownloadFileRequest: MessageTypeDefinition<
				_browser_proxy_v1_DownloadFileRequest,
				_browser_proxy_v1_DownloadFileRequest__Output
			>;
			DownloadFileResponse: MessageTypeDefinition<
				_browser_proxy_v1_DownloadFileResponse,
				_browser_proxy_v1_DownloadFileResponse__Output
			>;
			FetchHttpRequest: MessageTypeDefinition<
				_browser_proxy_v1_FetchHttpRequest,
				_browser_proxy_v1_FetchHttpRequest__Output
			>;
			FetchHttpResponse: MessageTypeDefinition<
				_browser_proxy_v1_FetchHttpResponse,
				_browser_proxy_v1_FetchHttpResponse__Output
			>;
			NavigatePageRequest: MessageTypeDefinition<
				_browser_proxy_v1_NavigatePageRequest,
				_browser_proxy_v1_NavigatePageRequest__Output
			>;
			NavigatePageResponse: MessageTypeDefinition<
				_browser_proxy_v1_NavigatePageResponse,
				_browser_proxy_v1_NavigatePageResponse__Output
			>;
		};
	};
}
