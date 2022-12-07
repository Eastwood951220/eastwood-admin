import axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig} from "axios";
import _ from 'lodash'


axios.defaults.headers['Content-Language'] = 'zh_CN'

class Request {

    // axios 实例
    instance: AxiosInstance

    // 实例拦截器
    interceptorsObj?: RequestInterceptors<AxiosResponse>

    // 基础配置
    baseConfig: AxiosRequestConfig = {
        baseURL: import.meta.env.VITE_APP_BASE_URL,
        timeout: 10 * 1000
    }

    // 构造函数
    constructor(config?: RequestConfig) {
        this.instance = axios.create(_.assign(this.baseConfig, config))

        this.instance.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
        this.instance.defaults.headers['Content-Language'] = 'zh_CN'

        this.interceptorsObj = config?.interceptors

        // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应

        // 全局请求拦截
        this.instance.interceptors.request.use(
            this._handleRequest,
            this._handleRequestError
        )

        // 实例请求拦截
        this.instance.interceptors.request.use(
            this.interceptorsObj?.requestInterceptors,
            this.interceptorsObj?.requestInterceptorsCatch,
        )

        // 实例响应拦截
        this.instance.interceptors.response.use(
            this.interceptorsObj?.responseInterceptors,
            this.interceptorsObj?.responseInterceptorsCatch,
        )

        // 全局响应拦截
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleResponseError
        )

    }

    request<T>(config: RequestConfig<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
            if (config.interceptors?.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config)
            }
            const url = config.url
            this.instance
                .request<any, T>(config)
                .then(res => {
                    // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
                    if (config.interceptors?.responseInterceptors) {
                        res = config.interceptors.responseInterceptors(res)
                    }
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
                .finally(() => {

                })
        })
    }

    private _handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
        return config
    }

    private _handleRequestError(err: any) {
        console.log(err)
        return Promise.reject(err)
    }

    private _handleResponse(res: AxiosResponse) {
        return res
    }

    private _handleResponseError(err: any) {
        console.log(err)
        return Promise.reject(err)
    }
}

export default Request
