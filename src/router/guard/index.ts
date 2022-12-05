import type {Router} from 'vue-router';
import {useUserStore} from "@/store/modules/user";
import {start, done} from "@/utils/nProgress";

const whiteList = ['/login']

function createPermissionGuard(router: Router) {
    const userStore = useUserStore();
    router.beforeEach(async (to) => {
        if (userStore.token) {
            if (to.path === '/login') {
                await router.replace({path: '/home'})
                return false
            } else {
                if (userStore.roles.length === 0) {
                    await userStore.getUserInfo()
                }
            }
        } else {

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