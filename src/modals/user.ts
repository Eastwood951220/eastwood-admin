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
    admin: boolean
    avatar: string
    delFlag: string
    dept: any
    deptId: number
    email: string
    loginDate: string
    loginIp: string
    nickName: string
    params: any
    password: string
    phonenumber: string
    postIds: any
    remark: string
    roleId: any
    roleIds: any
    sex: string
    status: string
    userId: number
    userName: string
    userType: string
}