import httpRequest from "@/utils/request";

import {CodeImgResponse, LoginParams, LoginResponse, UserInfoResponse} from "@/modals/user";

export function getCodeImg() {
    return httpRequest<null, CodeImgResponse>({
        url: '/captchaImage',
        headers: {
            isToken: false,
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
    return httpRequest<null, UserInfoResponse>({
        url: '/getInfo',
        method: 'get'
    })
}