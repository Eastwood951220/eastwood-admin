import httpRequest from "@/utils/request";
import {T_Q_UserList, T_R_DeptTree, T_R_UserList} from "@/modals/system/user";
import {parseStrEmpty} from "@/utils";
import {I_C_UserInfo, T_R_User} from "@/modals/user";

// 查询部门下拉树结构
export function deptTreeSelect() {
    return httpRequest<null, T_R_DeptTree>({
        url: '/system/user/deptTree',
        method: 'get'
    })
}

export function listUser(query: T_Q_UserList) {
    return httpRequest<T_Q_UserList, T_R_UserList>({
        url: '/system/user/list',
        method: 'get',
        params: query
    })
}

export function getUser(userId?: string) {
    return httpRequest<null, T_R_User>({
        url: `/system/user/${parseStrEmpty(userId)}`,
        method: 'get'
    })
}

// 新增用户
export function addUser(data: I_C_UserInfo) {
    return httpRequest<I_C_UserInfo>({
        url: '/system/user',
        method: 'post',
        data: data
    })
}

// 修改用户
export function updateUser(data: I_C_UserInfo) {
    return httpRequest<I_C_UserInfo>({
        url: '/system/user',
        method: 'put',
        data: data
    })
}

// 删除用户
export function deleteUser(userId: string) {
    return httpRequest({
        url: '/system/user/' + userId,
        method: 'delete'
    })
}

// 用户状态修改
export function changeUserStatus(userId: string, status: string) {
    return httpRequest({
        url: '/system/user/changeStatus',
        method: 'put',
        data: {
            userId,
            status
        }
    })
}

/*// 用户密码重置
export function resetUserPwd(userId, password) {
    const data = {
        userId,
        password
    }
    return request({
        url: '/system/user/resetPwd',
        method: 'put',
        data: data
    })
}



// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: '/system/user/profile',
        method: 'get'
    })
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: '/system/user/profile',
        method: 'put',
        data: data
    })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
    const data = {
        oldPassword,
        newPassword
    }
    return request({
        url: '/system/user/profile/updatePwd',
        method: 'put',
        params: data
    })
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: '/system/user/profile/avatar',
        method: 'post',
        data: data
    })
}

// 查询授权角色
export function getAuthRole(userId) {
    return request({
        url: '/system/user/authRole/' + userId,
        method: 'get'
    })
}

// 保存授权角色
export function updateAuthRole(data) {
    return request({
        url: '/system/user/authRole',
        method: 'put',
        params: data
    })
}*/