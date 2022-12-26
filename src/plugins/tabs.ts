import {useTagsViewStoreWithout} from "@/store/modules/tagsView";
import {RouteLocationMatched, RouteLocationNormalized} from "vue-router";
import {router} from '@/router'
import _ from 'lodash'

const tagsViewStore = useTagsViewStoreWithout()

export default {
    // 刷新当前tab页签
    refreshPage(route: RouteLocationNormalized) {
        return tagsViewStore.DelCachedView(route).then(async () => {
            const {path, query} = route
            await router.replace({
                path: '/redirect' + path,
                query: query
            })
        })
    },
    // 关闭当前页面
    closePage(route: RouteLocationNormalized) {
        if (!route) {
            return tagsViewStore.DelView(router.currentRoute.value)
        }
        return tagsViewStore.DelView(route)
    },
    // 关闭其他页面
    closeOtherPages(route: RouteLocationNormalized) {
        return tagsViewStore.DelOtherViews(route || router.currentRoute.value)
    },
    // 关闭所有页面
    closeAllPages() {
        return tagsViewStore.DelAllViews()
    },
    // 关闭左侧
    closeLeftPages(route: RouteLocationNormalized) {
        return tagsViewStore.DelLeftViews(route || router.currentRoute.value)
    },
    // 关闭右侧
    closeRightPages(route: RouteLocationNormalized) {
        return tagsViewStore.DelRightViews(route || router.currentRoute.value)
    },
}