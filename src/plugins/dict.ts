import {getDicts} from "@/apis/system/dict";
import {I_C_DictData, T_C_DictItem} from "@/modals/system/dict";
import {useDictStoreWithout} from "@/store/modules/dict";

const dictStore = useDictStoreWithout()


export default {
    async getDict(arr: string[]) {
        const resList: Promise<T_C_DictItem>[] = arr.map(item => {
            const storeDict = dictStore.searchDict(item)
            if (storeDict) return new Promise(resolve => resolve({key: item, value: storeDict}))
            return new Promise(resolve => {
                getDicts(item).then(res => {
                    dictStore.setDict(item, res.data)
                    resolve({key: item, value: res.data})
                })
            })
        })
        return Promise.all(resList)
    },
    setDict(arr: T_C_DictItem[]) {
        const data: Record<string, I_C_DictData[]> = {}
        arr.forEach(item => {
            data[item.key] = item.value
        })
        return data
    }
}
