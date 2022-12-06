import {defineStore} from "pinia";
import {RouteRecordRawPlus} from 'vue-router';
import {getRouters} from "@/apis/menu";
import * as _ from 'lodash'
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
            const data = await getRouters();
            const sData = _.cloneDeep(data.data)
            const rData = _.cloneDeep(data.data)
            initDynamicViewsModules()
            this.sidebarRouters = filterAsyncRouter(sData)
            const rewriteRoutes = filterAsyncRouter(rData, undefined, true)
            rewriteRoutes.push({path: '/:pathMatch(.*)*', redirect: '/404', hidden: true})
            rewriteRoutes.forEach(f => {
                router.addRoute(f)
            })
            this.addRoutes = rewriteRoutes
            this.routes = _.concat(constantRoutes, rewriteRoutes)
        }
    }
})
