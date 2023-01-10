import {VNode, DirectiveBinding, nextTick} from "vue";
import _ from "lodash";

export default {
    async mounted(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
        await nextTick()
        let maxTableHeight = 0
        const appMain = <HTMLElement>document.querySelector("#app-main")
        if (appMain) maxTableHeight = appMain.offsetHeight
        const searchBox = <HTMLElement>document.querySelector(".search-box")
        if (searchBox) maxTableHeight -= searchBox.offsetHeight
        const maxBoxHeight = _.max([maxTableHeight - 20, 620])
        if (binding.value === 1) {
            el.style.height = `${maxBoxHeight}px`
        }
        if (binding.value === 2 && maxBoxHeight !== undefined) {
            let maxTableHeight = maxBoxHeight
            const toolBar = <HTMLElement>document.querySelector(".tool-bar")
            if (toolBar) maxTableHeight -= toolBar.offsetHeight + 8
            const pagination = <HTMLElement>document.querySelector(".pagination-container")
            if (pagination) maxTableHeight -= pagination.offsetHeight + 12
            maxTableHeight -= 40
            // @ts-ignore
            vNode['ctx']['props']['maxHeight'] = `${maxTableHeight}px`
        }
    }
}