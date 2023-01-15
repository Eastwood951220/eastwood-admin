import {useUserStoreWithout} from "@/store/modules/user";
import {DirectiveBinding, VNode} from "vue";

const userStore = useUserStoreWithout()

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
        const { value } = binding
        const all_permission = "*:*:*";
        const permissions = userStore.permissions
        if (value && value instanceof Array && value.length > 0) {
            const permissionFlag = value

            const hasPermissions = permissions.some(permission => {
                return all_permission === permission || permissionFlag.includes(permission)
            })

            if (!hasPermissions) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`请设置操作权限标签值`)
        }
    }
}