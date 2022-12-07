import type {Router} from 'vue-router';
import {useUserStoreWithout} from "@/store/modules/user";
import {usePermissionStoreWithout} from "@/store/modules/permission";
import {done, start} from "@/utils/nProgress";
import {removeToken} from "@/utils/cookies";

const whiteList = ['/login']

function createPermissionGuard(router: Router) {
    router.beforeEach(async (to) => {
        document.title = to.meta.title || import.meta.env.VITE_APP_TITLE
        const userStore = useUserStoreWithout();
        const permissionStore = usePermissionStoreWithout();
        if (userStore.token) {
            if (to.path === '/login') {
                await router.replace({path: '/'})
                return false
            } else {
                if (userStore.roles.length === 0) {
                    try {
                        await userStore.GetUserInfo()
                        await permissionStore.GenerateRoutes()
                        await router.replace({...to})
                    } catch (e) {
                        handleErrorGuard(to.fullPath)
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