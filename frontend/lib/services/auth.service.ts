import { apiRequest } from "../api"
import { getUserFromToken } from "../utils/jwt"

export async function login(login: string, password: string) {
    const result = await apiRequest<{ token: string }>("/api/Auth/login", {
        method: "POST",
        body: JSON.stringify({ login, password }),
    })

    localStorage.setItem("token", result.token)

    return getUserFromToken()
}

export async function register(data: {
    login: string
    email: string
    nickname?: string | null
    password: string
    roleId?: number
}) {
    return await apiRequest<void>("/api/Auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    })
}

export function logout() {
    localStorage.removeItem("token")
}