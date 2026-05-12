declare module 'sockjs-client' {
    export interface SockJSOptions {
        server?: string;
        transports?: string | string[];
        sessionId?: number | (() => string);
        timeout?: number;
    }

    export default class SockJS extends WebSocket {
        constructor(url: string, protocols?: string | string[] | null, options?: SockJSOptions);
    }
}
