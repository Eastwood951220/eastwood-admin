import {defineStore} from "pinia";
import {store} from "@/store";
import {LoginParams, UserInfoResponse} from "@/modals/user";
import {UserInfoResult} from "@/modals/user";
import {getToken, removeToken, setToken} from "@/utils/cookies";
import {login, logout, getInfo} from '@/apis/user'

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
        Login: async function (params: LoginParams) {
            const res = await login(params)
            setToken(res.data.token)
            this.token = res.data.token
        },
        Logout: async function () {
            try {
                await logout()
            }finally {
                removeToken()
                this.token = ""
            }
        },
        GetUserInfo: async function () {
            const res = await getInfo()
            const data = res.data;
            this.roles = data.roles || []
            this.permissions = data.permissions || []
            this.user = data.user
        }
    }
})

export function useUserStoreWithout() {
    return useUserStore(store);
}

