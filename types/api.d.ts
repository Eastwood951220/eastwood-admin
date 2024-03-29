import {AxiosRequestConfig, AxiosResponse} from "axios";


declare global {
    /**
     * axios拦截器
     */
    interface RequestInterceptors<T> {
        // 请求拦截
        requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
        requestInterceptorsCatch?: (err: any) => any
        // 响应拦截
        responseInterceptors?: (res: T) => T
        responseInterceptorsCatch?: (err: any) => any
    }

    /**
     * axios请求参数类型重写
     */
    interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
        interceptors?: RequestInterceptors<T>
    }

    /**
     * axios返回参数重写
     */
    interface ResponseConfig<T, R> extends RequestConfig<R> {
        data?: T,
    }

    interface BaseApiResponse<T> {
        code: number
        msg: string
        data: T
    }

    interface BasePageResponse<T> {
        code: number
        msg: string
        rows: T[],
        total: number,
    }

    type BasePageParams<P extends Record<string, any> = unknown> = {
        pageNum: number,
        pageSize: number,
    } & P;

    interface DefaultPageResponse {
        createBy?: string
        createTime?: string
        params?: Record<string, any>
        searchValue?: string
        updateBy?: string
        updateTime?: string
    }

    interface downloadResponse{
        filename: string,
        data: Blob
    }

}

export {}