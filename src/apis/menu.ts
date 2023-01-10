import httpRequest from "@/utils/request";
import {T_R_Routers} from "@/modals/menu";

export const getRouters = () => {
    return httpRequest<null,T_R_Routers>({
        url: '/getRouters',
        method: 'get'
    })
}