import Request from './request'
import type {RequestConfig, HttpRequestConfig} from './types'

const request = new Request()

const httpRequest = <D = any, T = any>(config: HttpRequestConfig<D, T>) => {
    // @ts-ignore
    return request.request<RequestConfig<T>>(config)
}
// 取消请求
export const cancelRequest = (url: string | string[]) => {
    return request.cancelRequest(url)
}
// 取消全部请求
export const cancelAllRequest = () => {
    return request.cancelAllRequest()
}

export default httpRequest