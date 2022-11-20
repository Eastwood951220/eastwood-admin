import axios from 'axios'
import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {getToken} from "@/utils/cookies";
import type {
    RequestConfig,
    RequestInterceptors,
    CancelRequestSource,
} from './types'

class Request {
    // axios 实例
    instance: AxiosInstance
    // 拦截器对象
    interceptorsObj?: RequestInterceptors<AxiosResponse>
    // 基础配置，url和超时时间
    baseConfig: AxiosRequestConfig = {
        baseURL: import.meta.env.BASE_URL,
        timeout: 10 * 1000,
    }
    /**
     * 存放取消方法的集合
     * 在创建请求后将取消请求方法 push 到该集合中
     * 封装一个方法，可以取消请求，传入 url: string|string[]
     * 在请求之前判断同一URL是否存在，如果存在就取消请求
     */
    cancelRequestSourceList?: CancelRequestSource[]

    /**
     * 存放所有请求URL的集合
     * 请求之前需要将url push到该集合中
     * 请求完毕后将url从集合中删除
     * 添加在发送请求之前完成，删除在响应之后删除
     */
    requestUrlList?: string[]

    constructor(config: RequestConfig) {
        this.requestUrlList = []
        this.cancelRequestSourceList = []
        this.instance = axios.create(Object.assign(this.baseConfig, config))
        this.interceptorsObj = config.interceptors


        // 使用实例拦截器
        this.instance.interceptors.request.use(
            this.interceptorsObj?.requestInterceptors,
            this.interceptorsObj?.requestInterceptorsCatch,
        )

        this.instance.interceptors.response.use(
            this.interceptorsObj?.responseInterceptors,
            this.interceptorsObj?.responseInterceptorsCatch,
        )

        // 全局响应拦截器保证最后执行
        this.instance.interceptors.response.use(
            // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
            (res: AxiosResponse) => {
                return res.data
            },
            (err: any) => err,
        )
    }

    /**
     * @description: 获取指定 url 在 cancelRequestSourceList 中的索引
     * @param {string} url
     * @returns {number} 索引位置
     */
    private getSourceIndex(url: string): number {
        return this.cancelRequestSourceList?.findIndex(
            (item: CancelRequestSource) => {
                return Object.keys(item)[0] === url
            },
        ) as number
    }

    /**
     * @description: 删除 requestUrlList 和 cancelRequestSourceList
     * @param {string} url
     * @returns {*}
     */
    private delUrl(url: string) {
        const urlIndex = this.requestUrlList?.findIndex(u => u === url)
        const sourceIndex = this.getSourceIndex(url)
        // 删除url和cancel方法
        urlIndex !== -1 && this.requestUrlList?.splice(urlIndex as number, 1)
        sourceIndex !== -1 &&
        this.cancelRequestSourceList?.splice(sourceIndex as number, 1)
    }

    // 取消请求
    cancelRequest(url: string | string[]) {
        if (typeof url === 'string') {
            // 取消单个请求
            const sourceIndex = this.getSourceIndex(url)
            sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][url]()
        } else {
            // 存在多个需要取消请求的地址
            url.forEach(u => {
                const sourceIndex = this.getSourceIndex(u)
                sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][u]()
            })
        }
    }

    // 取消全部请求
    cancelAllRequest() {
        this.cancelRequestSourceList?.forEach(source => {
            const key = Object.keys(source)[0]
            source[key]()
        })
    }

    request<T>(config: RequestConfig<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
            if (config.interceptors?.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config)
            }
            const url = config.url

            if (url) {
                this.requestUrlList?.push(url)
                // TODO 在axios0.22起，对CancelToken已经弃用，需要改成  AbortController 文档：https://axios-http.com/docs/cancellation
                config.cancelToken = new axios.CancelToken(c => {
                    this.cancelRequestSourceList?.push({
                        [url]: c,
                    })
                })
            }
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
                    url && this.delUrl(url)
                })
        })
    }

    // 全局请求和响应拦截器
    private _handleRequest() {
    }

    private static _handleRequest(config: AxiosRequestConfig) {
        const isToken = (config.headers || {}).isToken === false;
        if (getToken() && !isToken) {

        }
        return config;
    }

    private static _handleRequestError(error: any) {
        console.log(error)
        return Promise.reject(error)
    }

    private static _handleResponse(response: AxiosResponse) {
        return response.data;
    }

    private static _handleResponseError(error: any) {
        return Promise.reject(error)
    }

}

export default Request
export {RequestConfig, RequestInterceptors}
