import httpRequest from "@/utils/request";
import {T_Q_UserList, T_R_DeptTree, T_R_UserList} from "@/modals/system/user";

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