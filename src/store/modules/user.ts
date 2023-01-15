import {defineStore} from "pinia";
import {store} from "@/store";
import {T_Q_Login, I_C_UserInfo} from "@/modals/user";
import {} from "@/modals/user";
import {getToken, removeToken, setToken} from "@/utils/cookies";
import {login, logout, getInfo} from '@/apis/user'

interface UserState {
    user: I_C_UserInfo;
    token?: string
    roles: string[];
    permissions: string[];
}

export const useUserStore = defineStore({
    id: "user",
    state: (): UserState => {
        return {
            user: {} as I_C_UserInfo,
            roles: [],
            permissions: [],
            token: getToken()
        }
    },
    actions: {
        Login: async function (params: T_Q_Login) {
            const res = await login(params)
            setToken(res.data.token)
            this.token = res.data.token
        },
        Logout: async function () {
            try {
                await logout()
            } finally {
                removeToken()
                this.token = ""
                location.href = "/login"
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

