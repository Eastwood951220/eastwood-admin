import type {Router} from 'vue-router';
import {ElMessage} from "element-plus";
import {useUserStoreWithout} from "@/store/modules/user";
import {usePermissionStoreWithout} from "@/store/modules/permission";
import {done, start, remove} from "@/utils/nProgress";
import {closeLoading, loading} from '@/utils/loading';
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
                            await ElMessage.error(<string>err)
                            await router.replace({path: '/'})
                        } catch (e) {
                            location.href = "/login"
                        }
                    }
                } else {
                    return true
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
    router.beforeEach(async (to, from) => {
        remove()
        start(to.matched.length);
        // closeLoading(true, from.matched.length, 'layout');
        // loading({}, to.matched.length, 'layout');
        return true;
    });
    router.afterEach(async (to, from) => {
        done(from.matched.length)
        // closeLoading(false, to.matched.length, 'layout');
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