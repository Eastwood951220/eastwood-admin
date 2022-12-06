import type {Router} from 'vue-router';
import {store} from "@/store";
import {useUserStore} from "@/store/modules/user";
import {usePermissionStore} from "@/store/modules/permission";
import {start, done} from "@/utils/nProgress";

const whiteList = ['/login']

function createPermissionGuard(router: Router) {
    router.beforeEach(async (to) => {
        const userStore = useUserStore(store);
        const permissionStore = usePermissionStore(store);
        if (userStore.token) {
            if (to.path === '/login') {
                await router.replace({path: '/'})
                return false
            } else {
                if (userStore.roles.length === 0) {
                    await userStore.GetUserInfo()
                    await permissionStore.GenerateRoutes()
                    return true
                }
            }
        } else {
            if (whiteList.includes(to.path)) {
                return true
            } else {
                await router.replace({
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    }
                })
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

export function setupRouterGuard(router: Router) {
    createPermissionGuard(router);
    createProgressGuard(router);
}