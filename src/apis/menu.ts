import httpRequest from "@/utils/request";

export const getRouters = () => {
    return httpRequest({
        url: '/getRouters',
        method: 'get'
    })
}