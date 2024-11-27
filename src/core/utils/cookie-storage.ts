import Cookies from 'js-cookie'

export const cookiesGetString = (key: string): any => {
    try {
        return Cookies.get(key)
    } catch (err) {
        return null
    }
}
