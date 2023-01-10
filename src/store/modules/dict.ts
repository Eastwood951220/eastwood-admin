import {defineStore} from "pinia";
import {store} from "@/store";
import {I_C_DictData, T_C_DictItem} from "@/modals/system/dict";
import _ from "lodash";


interface DictState {
    dictList: T_C_DictItem[]
}

export const useDictStore = defineStore({
    id: "dict",
    state: (): DictState => {
        return {
            dictList: []
        }
    },
    actions: {
        setDict(key: string, value: I_C_DictData[]) {
            if (key && value) {
                this.dictList.push({
                    key: key,
                    value: value
                })
            }
        },
        searchDict(key: string) {
            if (!key) return null
            const res = _.find(this.dictList, {key: key})
            if (res) {
                return res.value
            } else {
                return null
            }
        }
    }
})

export function useDictStoreWithout() {
    return useDictStore(store);
}