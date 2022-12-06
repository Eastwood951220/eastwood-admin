import httpRequest from "@/utils/request";

import {CodeImgResponse, LoginParams, LoginResponse, UserInfoResponse} from "@/modals/user";

export function getCodeImg() {
    return httpRequest<CodeImgResponse>({
        url: '/captchaImage',
        headers: {
            isToken: false,
            isLoading: true
        },
        method: 'get',
        timeout: 20000
    })
}

export function login(data: LoginParams) {
    return httpRequest<LoginParams, LoginResponse>({
        url: '/login',
        headers: {
            isToken: false,
        },
        method: 'post',
        data,
    })
}

export function logout() {
    return httpRequest({
        url: '/logout',
        method: 'post'
    })
}

export function getInfo() {
    return httpRequest<UserInfoResponse>({
        url: '/getInfo',
        method: 'get'
    })
}