import {RouteLocationNormalized, RouteRecordName} from "vue-router";
import {defineStore} from "pinia";
import {store} from "@/store";
import * as _ from 'lodash'


interface TagsViewState {
    visitedViews: RouteLocationNormalized[],
    cachedViews: RouteRecordName[],
    iframeViews: RouteLocationNormalized[]
}

export const useTagsViewStore = defineStore({
    id: 'tagsView',
    state: (): TagsViewState => {
        return {
            visitedViews: [],
            cachedViews: [],
            iframeViews: []
        }
    },
    actions: {
        AddView: function (view: RouteLocationNormalized) {
            this.AddVisitedView(view)
            this.AddCachedView(view)
        },
        AddVisitedView: function (view: RouteLocationNormalized) {
            if (this.visitedViews.some(v => v.path === view.path)) return
            this.visitedViews.push(_.assign({}, view, {
                title: view.meta.title || 'no-name'
            }))
        },
        AddCachedView: function (view: RouteLocationNormalized) {
            if (this.cachedViews.includes(<RouteRecordName>view.name)) return
            if (view.meta && !view.meta.noCache) {
                this.cachedViews.push(<RouteRecordName>view.name)
            }
        },
        AddIframeView: function (view: RouteLocationNormalized) {
            if (this.iframeViews.some(v => v.path === view.path)) return
            this.iframeViews.push(_.assign({}, view, {
                title: view.meta.title || 'no-name'
            }))
        }
    }
})

export function useTagsViewStoreWithout() {
    return useTagsViewStore(store)
}