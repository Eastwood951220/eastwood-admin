export type T_R_CodeImg = BaseApiResponse<{
    captchaEnabled: boolean
    img: string
    uuid: string
}>

export type T_Q_Login = {
    code: string
    password: string
    username: string
    uuid: string
}

export type T_R_Login = BaseApiResponse<{
    token: string
}>

export type T_R_UserInfo = BaseApiResponse<{
    permissions: string[]
    roles: string[]
    user: I_C_UserInfo
}>

export interface I_C_UserInfo extends DefaultPageResponse {
    admin?: boolean
    avatar?: string
    delFlag?: string
    dept?: any
    deptId: number
    email: string
    loginDate?: string
    loginIp?: string
    nickName: string
    password: string
    phonenumber: string
    postIds: any
    remark: string
    roleId?: any
    roleIds: any
    sex: string
    status: string
    userId?: string
    userName: string
    userType?: string
}

export type T_R_User = BaseApiResponse<{
    postIds?: number[],
    posts: any[],
    roleIds?: number[],
    roles: any[],
    user?: I_C_UserInfo
}>

export class C_UserInfo implements I_C_UserInfo {
    userId: any = undefined
    deptId: any = undefined
    userName: string = ""
    nickName: string = ""
    email: string = ""
    password: string = ""
    phonenumber: string = ""
    sex: string = ""
    status: string = "0"
    remark: string = ""
    postIds = []
    roleIds = []
}