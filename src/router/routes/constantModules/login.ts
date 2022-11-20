import {RouteRecordRaw} from "vue-router";

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/login/Index.vue')
    }
]
