export interface I_C_DictData extends DefaultPageResponse {
    dictCode: number
    dictSort: number
    dictLabel: string
    dictValue: string
    dictType: string
    cssClass: string
    listClass: string
    isDefault: string
    status: string
    remark: string
}

export type T_C_DictItem = {
    key: string,
    value: I_C_DictData[]
}

export type T_R_DictData = BaseApiResponse<I_C_DictData []>