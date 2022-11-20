import Cookies from 'js-cookie'

class Keys {
    static tokenKey = 'east-admin-access-token'
}

export const getToken = () => Cookies.get(Keys.tokenKey)
export const setToken = (token: string) => Cookies.set(Keys.tokenKey, token)
export const removeToken = () => Cookies.remove(Keys.tokenKey)


