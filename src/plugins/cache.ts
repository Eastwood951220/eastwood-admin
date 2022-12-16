const sessionCache = {
    set(key: string, value: string) {
        if (!sessionStorage) {
            return
        }
        if (key != null && value != null) {
            sessionStorage.setItem(key, value)
        }
    },
    get(key: string) {
        if (!sessionStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return sessionStorage.getItem(key)
    },
    remove(key: string) {
        sessionStorage.removeItem(key);
    }
}
const localCache = {
    set(key: string, value: string) {
        if (!localStorage) {
            return
        }
        if (key != null && value != null) {
            localStorage.setItem(key, value)
        }
    },
    get(key: string) {
        if (!localStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return localStorage.getItem(key)
    },
    remove(key: string) {
        localStorage.removeItem(key);
    }
}

export default {
    /**
     * 会话级缓存
     */
    session: sessionCache,
    /**
     * 本地缓存
     */
    local: localCache
}