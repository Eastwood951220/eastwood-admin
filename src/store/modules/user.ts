import {defineStore} from "pinia";
import {LoginParams, UserInfoResponse} from "@/types/user";
import {UserInfoResult} from "@/types/user";
import {getToken, removeToken} from "@/utils/cookies";
import {login as loginApi, logout as logoutApi, getInfo} from '@/apis/user'

interface UserState {
    user: UserInfoResult;
    token?: string
    roles: string[];
    permissions: string[];
}

export const useUserStore = defineStore({
    id: "user",
    state: (): UserState => {
        return {
            user: {} as UserInfoResult,
            roles: [],
            permissions: [],
            token: getToken()
        }
    },
    actions: {
        login: async function (params: LoginParams) {
            const res = await loginApi(params)
            this.token = res.data.token
        },
        logout: async function () {
            await logoutApi()
            removeToken()
            this.token = ""
        },
        getUserInfo: async function () {
            const res = await getInfo()
            const data: UserInfoResponse = res.data;
            console.log(data)
            this.roles = data.roles || []
            this.permissions = data.permissions || []
            this.user = data.user
        }
    }
})

