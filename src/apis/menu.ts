import httpRequest from "@/utils/request";
import {GetRoutersResponse} from "@/modals/menu";

export const getRouters = () => {
    return httpRequest<null,GetRoutersResponse>({
        url: '/getRouters',
        method: 'get'
    })
}