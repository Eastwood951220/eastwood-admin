import {RouteRecordRawPlus} from "vue-router";
import Layout from '@/layout/index.vue'

export const routes: Array<RouteRecordRawPlus> = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect.vue')
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        meta: {title: '登陆'},
        component: () => import('@/views/login.vue'),
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
                meta: {title: '首页', affix: true, icon: 'dashboard'}
            }
        ]
    },
]
