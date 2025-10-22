// Original file: proto/browser_proxy/browser_proxy.proto

export interface CreateSessionRequest {
	cookies?: { [key: string]: string };
	defaultHeaders?: { [key: string]: string };
}

export interface CreateSessionRequest__Output {
	cookies: { [key: string]: string };
	defaultHeaders: { [key: string]: string };
}
