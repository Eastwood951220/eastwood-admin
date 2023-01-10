import httpRequest from "@/utils/request";
import {T_R_DictData} from "@/modals/system/dict";

export function getDicts(dictType: string) {
    return httpRequest<null, T_R_DictData>({
        url: `/system/dict/data/type/${dictType}`,
        method: 'get',
    })
}