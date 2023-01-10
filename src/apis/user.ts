import httpRequest from "@/utils/request";

import {T_R_CodeImg, T_Q_Login, T_R_Login, T_R_UserInfo} from "@/modals/user";

export function getCodeImg() {
    return httpRequest<null, T_R_CodeImg>({
        url: '/captchaImage',
        headers: {
            isToken: false,
        },
        method: 'get',
        timeout: 20000
    })

}

export function login(data: T_Q_Login) {
    return httpRequest<T_Q_Login, T_R_Login>({
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
    return httpRequest<null, T_R_UserInfo>({
        url: '/getInfo',
        method: 'get'
    })
}