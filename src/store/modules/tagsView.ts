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
        DelView: function (view: RouteLocationNormalized) {
            return new Promise(async resolve => {
                await this.DelVisitedView(view)
                await this.DelCachedView(view)
                resolve({
                    visitedViews: _.cloneDeep(this.visitedViews),
                    cachedViews: _.cloneDeep(this.cachedViews),
                })
            })
        },
        AddVisitedView: function (view: RouteLocationNormalized) {
            if (this.visitedViews.some(v => v.path === view.path)) return
            this.visitedViews.push(_.assign({}, view, {
                title: view.meta.title || 'no-name'
            }))
        },
        DelVisitedView: function (view: RouteLocationNormalized) {
            return new Promise(resolve => {
                _.remove(this.visitedViews, v => {
                    return view.path === v.path
                })
                this.iframeViews = _.filter(this.iframeViews, v => v.path !== view.path)
                resolve(_.cloneDeep(this.visitedViews))
            })
        },
        AddCachedView: function (view: RouteLocationNormalized) {
            if (this.cachedViews.includes(<RouteRecordName>view.name)) return
            if (view.meta && !view.meta.noCache) {
                this.cachedViews.push(<RouteRecordName>view.name)
            }
        },
        DelCachedView: function (view: RouteLocationNormalized) {
            return new Promise((resolve) => {
                _.remove(this.cachedViews, v => {
                    return view.name === v
                })
                resolve(_.cloneDeep(this.cachedViews))
            })
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