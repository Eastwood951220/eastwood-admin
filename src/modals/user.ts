export interface CodeImgResponse {
    captchaEnabled: boolean
    img: string
    uuid: string
}

export interface LoginParams {
    code: string
    password: string
    username: string
    uuid: string
}

export interface LoginResponse {
    token: string
}

export interface UserInfoResponse {
    permissions: string[]
    roles: string[]
    user: UserInfoResult
}

export interface UserInfoResult {
    admin: boolean
    avatar: string
    createBy: string
    createTime: string
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
    searchValue: any
    sex: string
    status: string
    updateBy: string
    updateTime: string
    userId: number
    userName: string
    userType: string
}