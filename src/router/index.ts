import {createRouter, createWebHistory, RouteRecordRawPlus} from 'vue-router'
import type {App} from 'vue';
import {setupRouterGuard} from './guard';
import {concatObjectValue} from '@/utils/helper';

export const constantRoutes = concatObjectValue<RouteRecordRawPlus>(
    import.meta.glob('./routes/constantModules/*.ts', {eager: true, import: 'routes'})
)

export const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
})

export function setupRouter(app: App<Element>) {
    setupRouterGuard(router)
}

