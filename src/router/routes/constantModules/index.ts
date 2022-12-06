import {RouteRecordRawPlus} from "vue-router";
import Layout from '@/layout/index.vue'

export const routes: Array<RouteRecordRawPlus> = [
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/login/index.vue'),
        hidden: true
    },
    {
        path: "/404",
        name: "404",
        component: () => import('@/views/404.vue'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/dashboard/index.vue'),
                name: 'Index',
                meta: {title: '首页', affix: true}
            }
        ]
    },
]
