import {AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from "axios";
import {ElMessage, ElMessageBox} from 'element-plus';
import Request from './request'
import {getToken, removeToken} from "@/utils/cookies";
import {useUserStoreWithout} from '@/store/modules/user'
import {tansParams} from "@/utils";
import errorCode from "@/config/errorCode";

export let isReLogin = {show: false};
const request = new Request({
    interceptors: {
        // 请求拦截器
        requestInterceptors: _requestInterceptors,
        requestInterceptorsCatch: _requestInterceptorsCatch,
        // 响应拦截
        responseInterceptors: _responseInterceptors,
        responseInterceptorsCatch: _responseInterceptorsCatch
    }
})

function _requestInterceptors(config: AxiosRequestConfig): AxiosRequestConfig {
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        (config.headers as AxiosRequestHeaders)['Authorization'] = 'Bearer ' + getToken()
    }
    const isDownload = (config.headers || {}).isDownload === "true"
    if (isDownload) {
        (config.headers as AxiosRequestHeaders)['Content-Type'] = 'application/x-www-form-urlencoded'
        config.responseType = "blob"
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        config.params = {};
        config.url = url;
    }
    return config
}

function _requestInterceptorsCatch(err: any) {
    return Promise.reject(err)
}

function _responseInterceptors(response: AxiosResponse) {
    const userStore = useUserStoreWithout()
    const data = response && response.data
    if (!data) {
        ElMessage({
            message: "服务器异常",
            type: 'error',
            duration: 5 * 1000
        })
        removeToken()
        return Promise.reject("服务器异常")
    }
    const isDownload = (response.config.headers || {}).isDownload === "true"
    if (isDownload) {
        const filename = decodeURI(<string>response.headers['download-filename']) || (response.config.headers || {})["download-filename"]
        return {
            filename,
            data
        }
    }
    const code = data.code || 200;
    const msg = data.msg || errorCode[code] || errorCode.default
    switch (code) {
        case 200:
            return data
        case 401:
            if (!isReLogin.show) {
                isReLogin.show = true
                ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(async () => {
                    try {
                        await userStore.Logout()
                        location.href = import.meta.env.VITE_APP_CONTEXT_PATH + "index";
                    } catch (e) {
                        location.href = "/login"
                    }
                }).finally(() => {
                    isReLogin.show = false
                })
            }
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        default:
            ElMessage({
                message: msg,
                type: 'error'
            })
            return Promise.reject(new Error(msg))
    }
}

function _responseInterceptorsCatch(error: any) {
    console.warn(error)
    let {message} = error;
    if (error.response && error.response.data) {
        message = error.response.data.msg
    } else if (message === "Network Error") {
        message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
        message = "系统接口异常";
    }
    ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000
    })

    return Promise.reject(error)
}

const httpRequest = <D = any, T = any>(config: ResponseConfig<D, T>) => {
    return request.request<T>(config)
}

export default httpRequest