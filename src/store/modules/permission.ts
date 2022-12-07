import {defineStore} from "pinia";
import {RouteRecordRawPlus} from 'vue-router';
import * as _ from 'lodash'
import {store} from '@/store'
import {getRouters} from "@/apis/menu";
import {initDynamicViewsModules, filterAsyncRouter} from "@/utils/permission";
import {router, constantRoutes} from '@/router'

interface PermissionState {
    routes: RouteRecordRawPlus[]
    addRoutes: RouteRecordRawPlus[]
    defaultRoutes: RouteRecordRawPlus[]
    topBarRouters: RouteRecordRawPlus[]
    sidebarRouters: RouteRecordRawPlus[]
}

export const usePermissionStore = defineStore({
    id: "permission",
    state: (): PermissionState => {
        return {
            routes: [],
            addRoutes: [],
            defaultRoutes: [],
            topBarRouters: [],
            sidebarRouters: []
        }
    },
    actions: {
        GenerateRoutes: async function () {
            initDynamicViewsModules()
            const data = await getRouters();
            const sData = _.cloneDeep(data.data)
            const rData = _.cloneDeep(data.data)
            const sidebarRouters = filterAsyncRouter(sData)
            const rewriteRoutes = filterAsyncRouter(rData, undefined, true)
            rewriteRoutes.push({path: '/:pathMatch(.*)*', redirect: '/404', hidden: true})
            rewriteRoutes.forEach(route => {
                router.addRoute(route)
            })
            this.sidebarRouters = sidebarRouters
            this.addRoutes = rewriteRoutes
            this.routes = _.concat(constantRoutes, rewriteRoutes)
        }
    }
})

export function usePermissionStoreWithout() {
    return usePermissionStore(store)
}
