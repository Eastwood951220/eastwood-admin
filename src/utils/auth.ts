import {useUserStoreWithout} from "@/store/modules/user";

const userStore =  useUserStoreWithout()

function authPermission(permission: string) {
    const all_permission = "*:*:*";
    const permissions = userStore && userStore.permissions
    if (permission && permission.length > 0) {
        return permissions.some(v => {
            return all_permission === v || v === permission
        })
    } else {
        return false
    }
}

function authRole(role: string) {
    const super_admin = "admin";
    const roles = userStore && userStore.roles
    if (role && role.length > 0) {
        return roles.some(v => {
            return super_admin === v || v === role
        })
    } else {
        return false
    }
}

export default {
    /**
     * 验证用户是否具备某权限
     * @param permission
     */
    hasPermission(permission: string) {
        return authPermission(permission);
    },
    /**
     * 验证用户是否含有指定权限，只需包含其中一个
     * @param permissions
     */
    hasPermissionOr(permissions: string[]) {
        return permissions.some(item => {
            return authPermission(item)
        })
    },
    /**
     * 验证用户是否含有指定权限，必须全部拥有
     * @param permissions
     */
    hasPermissionAnd(permissions: string[]) {
        return permissions.every(item => {
            return authPermission(item)
        })
    },
    /**
     * 验证用户是否具备某角色
     * @param role
     */
    hasRole(role: string) {
        return authRole(role);
    },
    /**
     * 验证用户是否含有指定角色，只需包含其中一个
     * @param roles
     */
    hasRoleOr(roles: string[]) {
        return roles.some(item => {
            return authRole(item)
        })
    },
    /**
     * 验证用户是否含有指定角色，必须全部拥有
     * @param roles
     */
    hasRoleAnd(roles: string[]) {
        return roles.every(item => {
            return authRole(item)
        })
    }
}