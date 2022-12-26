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
        // 打开标签页
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
        },
        // 关闭当前页面
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
        DelVisitedView: function (view: RouteLocationNormalized) {
            return new Promise(resolve => {
                _.remove(this.visitedViews, v => {
                    return view.path === v.path
                })
                this.iframeViews = _.filter(this.iframeViews, v => v.path !== view.path)
                resolve(_.cloneDeep(this.visitedViews))
            })
        },
        DelCachedView: function (view: RouteLocationNormalized) {
            return new Promise((resolve) => {
                _.remove(this.cachedViews, v => {
                    return view.name === v
                })
                resolve(_.cloneDeep(this.cachedViews))
            })
        },
        // 关闭其他标签
        DelOtherViews: function (view: RouteLocationNormalized) {
            return new Promise(async resolve => {
                await this.DelOtherVisitedView(view)
                await this.DelOtherCachedView(view)
                resolve({
                    visitedViews: _.cloneDeep(this.visitedViews),
                    cachedViews: _.cloneDeep(this.cachedViews),
                })
            })
        },
        DelOtherVisitedView: function (view: RouteLocationNormalized) {
            return new Promise(resolve => {
                _.remove(this.visitedViews, v => {
                    return view.path !== v.path && !v.meta.affix
                })
                this.iframeViews = _.filter(this.iframeViews, v => v.path === view.path)
                resolve(_.cloneDeep(this.visitedViews))
            })
        },
        DelOtherCachedView: function (view: RouteLocationNormalized) {
            return new Promise((resolve) => {
                _.remove(this.cachedViews, v => {
                    return view.name !== v
                })
                resolve(_.cloneDeep(this.cachedViews))
            })
        },
        // 关闭所有标签
        DelAllViews: function () {
            return new Promise(async resolve => {
                await this.DelAllVisitedViews()
                await this.DelAllCachedViews()
                resolve({
                    visitedViews: _.cloneDeep(this.visitedViews),
                    cachedViews: _.cloneDeep(this.cachedViews),
                })
            })
        },
        DelAllVisitedViews: function () {
            return new Promise(resolve => {
                _.remove(this.visitedViews, v => {
                    return !v.meta.affix
                })
                this.iframeViews = []
                resolve(_.cloneDeep(this.visitedViews))
            })
        },
        DelAllCachedViews: function () {
            return new Promise(resolve => {
                this.cachedViews = []
                resolve(_.cloneDeep(this.cachedViews))
            })
        },
        // 关闭左侧
        DelLeftViews: function (view: RouteLocationNormalized) {
            const index = _.findIndex(this.visitedViews, {path: view.path})
            return new Promise(resolve => {
                _.remove(this.visitedViews, (v, i) => {
                    if (i < index && !v.meta.affix) {
                        _.remove(this.cachedViews, c => c === v.name)
                        if (v.meta && v.meta.link) {
                            _.remove(this.iframeViews, c => c.path === v.path)
                        }
                        return true
                    }
                    return false
                })
            })
        },
        DelRightViews: function (view: RouteLocationNormalized) {
            const index = _.findIndex(this.visitedViews, {path: view.path})
            return new Promise(resolve => {
                _.remove(this.visitedViews, (v, i) => {
                    if (i > index && !v.meta.affix) {
                        _.remove(this.cachedViews, c => c === v.name)
                        if (v.meta && v.meta.link) {
                            _.remove(this.iframeViews, c => c.path === v.path)
                        }
                        return true
                    }
                    return false
                })
            })
        }

    }
})

export function useTagsViewStoreWithout() {
    return useTagsViewStore(store)
}