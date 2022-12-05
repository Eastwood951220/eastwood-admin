import type {AxiosRequestConfig, AxiosResponse} from 'axios'


export interface RequestInterceptors<T> {
    // 请求拦截
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorsCatch?: (err: any) => any
    // 响应拦截
    responseInterceptors?: (config: T) => T
    responseInterceptorsCatch?: (err: any) => any
}

// 自定义传入的参数
export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
    interceptors?: RequestInterceptors<T>
    headers?: any
}

export interface CancelRequestSource {
    [index: string]: () => void
}

export interface HttpResponse<T> {
    code: number,
    data?: T,
    rows?: T[],
    total?: number,
    msg: string
}

// 重写返回类型
export interface HttpRequestConfig<T, R> extends RequestConfig<HttpResponse<R>> {
    data?: T,
}