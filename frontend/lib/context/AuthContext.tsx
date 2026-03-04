"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getUserFromToken, CurrentUser } from "@/lib/utils/jwt"
import * as authService from "@/lib/services/auth.service"

interface AuthContextType {
    user: CurrentUser | null
    isAuthenticated: boolean
    loading: boolean
    login: (login: string, password: string) => Promise<CurrentUser | null>
    logout: () => void
    register: (data: {
        login: string
        email: string
        nickname?: string | null
        password: string
    }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<CurrentUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const currentUser = getUserFromToken()
        setUser(currentUser)
        setLoading(false)
    }, [])

    async function login(loginValue: string, passwordValue: string) {
        const user = await authService.login(loginValue, passwordValue)
        setUser(user)
        return user
    }

    async function register(data: {
        login: string
        email: string
        nickname?: string | null
        password: string
    }) {
        await authService.register(data)
    }

    function logout() {
        authService.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
                register: authService.register
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context
}