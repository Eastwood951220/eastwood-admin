import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import type {App} from 'vue';
import {concatObjectValue} from '@/utils/helper';

const constantRoutes = concatObjectValue<RouteRecordRaw>(
    import.meta.glob('./routes/constantModules/*.ts', {eager: true, import: 'routes'})
)

export const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
})

export function setupRouter(app: App<Element>) {
    app.use(router)
}