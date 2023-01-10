import _ from 'lodash'

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: Record<string, any>) {
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
    return _.join(result, '&')
}

/**
 * 设置查询条件
 * @param {Record<string, any>} queryParams
 * @param propName
 */
export function addDataRange<T extends Record<string, any>>(queryParams: T, propName?: String) {
    let params = _.cloneDeep(queryParams)
    if (!(typeof (params.params) === 'object' && params.params !== null && !Array.isArray(params.params))) {
        _.assign(params, {params: {}})
    }
    for (let key in params) {
        if (_.upperCase(key).includes("RANGE")) {
            let value = params[key]
            if (value && Array.isArray(value) && value.length > 0) {
                if (typeof (propName) === 'undefined') {
                    params.params['beginTime'] = value[0];
                    params.params['endTime'] = value[1];
                } else {
                    params.params['begin' + propName] = value[0];
                    params.params['end' + propName] = value[1];
                }
            }
            delete params[key]
        }
    }
    return params
}


