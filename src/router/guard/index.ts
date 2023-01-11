import type {Router} from 'vue-router';
import {ElMessage} from "element-plus";
import {useUserStoreWithout} from "@/store/modules/user";
import {usePermissionStoreWithout} from "@/store/modules/permission";
import {done, start} from "@/utils/nProgress";
import {removeToken} from "@/utils/cookies";
import {isReLogin} from '@/utils/request'

const whiteList = ['/login']

function createPermissionGuard(router: Router) {
    router.beforeEach(async (to) => {
        document.title = import.meta.env.VITE_APP_TITLE + "-" + to.meta.title
        const userStore = useUserStoreWithout();
        const permissionStore = usePermissionStoreWithout();
        if (userStore.token) {
            if (to.path === '/login') {
                await router.replace({path: '/'})
                return false
            } else {
                if (userStore.roles.length === 0) {
                    isReLogin.show = true
                    try {
                        await userStore.GetUserInfo()
                        isReLogin.show = false
                        await permissionStore.GenerateRoutes()
                        await router.replace({...to})
                    } catch (err) {
                        try {
                            await userStore.Logout()
                            ElMessage.error(<string>err)
                            await router.replace({path: '/'})
                        } catch (e) {
                            location.href = "/login"
                        }
                    }
                }
            }
        } else {
            if (whiteList.includes(to.path)) {
                return true
            } else {
                handleErrorGuard(to.fullPath)
            }
        }
    })
}

function createProgressGuard(router: Router) {
    router.beforeEach(async (to) => {
        start(to.matched.length);
        return true;
    });
    router.afterEach(async () => {
        done()
    })
}

function handleErrorGuard(path?: string) {
    if (!window.location.pathname.includes('login')) {
        window.location.href = `/login?redirect=${path}`
    }
    removeToken()
}

export function setupRouterGuard(router: Router) {
    createPermissionGuard(router);
    createProgressGuard(router);
}