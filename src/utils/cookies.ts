import Cookies from 'js-cookie'
import config from '@/config/login'

export const getToken = () => Cookies.get(config.tokenName)
export const setToken = (token: string) => Cookies.set(config.tokenName, token, {
    expires: config.tokenExpires,
    domain: config.tokenDomain
})
export const removeToken = () => Cookies.remove(config.tokenName, {
    domain: config.tokenDomain
})


