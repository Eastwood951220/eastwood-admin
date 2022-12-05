import {RouteRecordRaw} from "vue-router";

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/login/Index.vue')
    },
    {
        path: "/home",
        name: "Home",
        component: () => import('@/views/dashboard/Index.vue')
    }
]
