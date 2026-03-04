const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(options.headers || {}),
        },
    })

    if (res.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/auth"
        throw new Error("Unauthorized")
    }

    if (!res.ok) {
        const text = await res.text()

        try {
            const errorJson = JSON.parse(text)
            throw new Error(errorJson.error || errorJson.message || text || `Error ${res.status}`)
        } catch (e) {
            if (e instanceof Error && e.message !== text) {
                throw e
            }
            throw new Error(text || `Error ${res.status}`)
        }
    }

    if (res.status === 204) return null as T

    const text = await res.text()

    if (!text) return null as T

    return JSON.parse(text)
}