import {I_C_UserInfo} from "@/modals/user";

export interface I_C_DeptTree {
    children: I_C_DeptTree[]
    id: number
    label: string
    parentId: string
    weight: string
}

export type T_R_DeptTree = BaseApiResponse<I_C_DeptTree []>

export type T_Q_UserList = BasePageParams<{
    userName: string,
    phonenumber: string,
    status: string,
    deptId: string,
    dateRange: string[]
}>

export type T_R_UserList = BasePageResponse<I_C_UserInfo>


