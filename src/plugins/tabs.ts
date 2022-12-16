import {useTagsViewStoreWithout} from "@/store/modules/tagsView";
import {RouteLocationMatched, RouteLocationNormalized} from "vue-router";
import {router} from '@/router'

const tagsViewStore = useTagsViewStoreWithout()

export default {
    // 刷新当前tab页签
    refreshPage(route: RouteLocationNormalized) {

        console.log(router)
        const {path, query, matched} = router.currentRoute.value;
        console.log(matched)
        return tagsViewStore.DelCachedView(route).then(async () => {
            const {path, query} = route
            await router.replace({
                path: '/redirect' + path,
                query: query
            })
        })
    },
    closePage(route: RouteLocationNormalized) {
        console.log(router)
        if (!route) {
            return tagsViewStore.DelView(router.currentRoute.value)
        }
        return tagsViewStore.DelView(route)
    }
}