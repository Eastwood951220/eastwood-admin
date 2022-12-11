import {DefineComponent} from 'vue';
import {RouteRecordRawPlus, RouteComponent} from 'vue-router';
import auth from "@/utils/auth";
import Layout from '@/layout/index.vue'
import ParentView from "@/layout/components/ParentView/index.vue"
import InnerLink from '@/layout/components/InnerLink/index.vue'
import Page404 from '@/views/404.vue'

export function filterDynamicRoutes(routes: RouteRecordRawPlus[]) {
    const res: RouteRecordRawPlus[] = []
    routes.forEach(route => {
        if (route.permissions) {
            if (auth.hasPermissionOr(route.permissions)) {
                res.push(route)
            }
        } else if (route.roles) {
            if (auth.hasRoleOr(route.roles)) {
                res.push(route)
            }
        }
    })
    return res
}


export type DynamicViewsModules = Record<string, () => Promise<DefineComponent>>;
let dynamicViewsModules: DynamicViewsModules;

export function initDynamicViewsModules() {
    if (!dynamicViewsModules) {
        dynamicViewsModules = import.meta.glob('@/views/**/*.vue') as Record<string, () => Promise<DefineComponent>>;
    }
}

export function transitionComponent(component: string): RouteComponent {
    switch (component) {
        case 'Layout':
            return Layout
        case 'ParentView':
            return ParentView
        case 'InnerLink':
            return InnerLink
        default:
            const moduleName = `/src/views/${component}.vue`
            if (dynamicViewsModules[moduleName]) {
                return dynamicViewsModules[moduleName]
            } else {
                return Page404
            }
    }
}

export function filterAsyncRouter(asyncRouterMap: RouteRecordRawPlus[], lastRouter?: RouteRecordRawPlus, type?: boolean) {
    return asyncRouterMap.filter(route => {
        // 去除外链
        if (type && route.meta?.link) {
            return false
        }
        if (type && route.children) {
            route.children = filterChildren(route.children)
        }
        if (route.component) {
            route.component = transitionComponent(<string>route.component)
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
}

function filterChildren(childrenMap: RouteRecordRawPlus[], lastRouter?: RouteRecordRawPlus): RouteRecordRawPlus[] {
    let children: RouteRecordRawPlus[] = []
    childrenMap.forEach((el: RouteRecordRawPlus) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView' && !lastRouter) {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
}


