import jwtDecode from "jwt-decode"

export default function getCurrentUser() {
    const token = localStorage.getItem('jwt')
    if (token) return jwtDecode<{
        _id: string,
        isVerified: boolean
    }>(token)
}

/*

return {
    _id: 'a68sd5',
    isVerified: false
}

*/