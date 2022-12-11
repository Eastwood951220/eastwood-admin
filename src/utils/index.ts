import _ from 'lodash'
/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params:Record<string, any>) {
    let result = []
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        const part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        let subPart = encodeURIComponent(params) + "=";
                        result.push(subPart + encodeURIComponent(value[key]))
                    }
                }
            } else {
                result.push(part + encodeURIComponent(value))
            }
        }
    }
    return _.join(result,'&')
}