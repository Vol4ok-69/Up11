import { jwtDecode } from "jwt-decode"

export interface JwtPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
    exp: number
}

export interface CurrentUser {
    id: string
    login: string
    role: string
}

export function getUserFromToken(): CurrentUser | null {
    if (typeof window === "undefined") return null

    const token = localStorage.getItem("token")
    if (!token) return null

    try {
        const decoded = jwtDecode<JwtPayload>(token)

        return {
            id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            login:
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            role:
                decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ],
        }
    } catch {
        return null
    }
}