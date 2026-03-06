const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    console.log(`[API Request] ${options.method || "GET"} ${endpoint}`, {
        body: options.body,
    })

    try {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null

        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...(options.body && !(options.body instanceof FormData)
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(options.headers || {}),
            },
        })

        const rawText = await res.text()

        if (res.status === 401) {
            console.error(`[API Error] 401 Unauthorized on ${endpoint}`)
            localStorage.removeItem("token")
            window.location.href = "/auth"
            throw new Error("Unauthorized")
        }

        if (!res.ok) {
            console.error(`[API Error] ${res.status} on ${endpoint}:`, rawText)

            try {
                const errorJson = JSON.parse(rawText)
                throw new Error(
                    errorJson.error ||
                    errorJson.message ||
                    rawText ||
                    decodeUnicode(rawText) ||
                    `Error ${res.status}`
                )
            } catch {
                throw new Error(rawText || `Error ${res.status}`)
            }
        }

        if (res.status === 204 || !rawText) {
            console.log(`[API Response] No Content on ${endpoint}`)
            return null as T
        }

        const data = JSON.parse(rawText)
        console.log(`[API Response] Success on ${endpoint}`, data)

        return data as T

    } catch (error) {
        console.error(
            `[API Exception] on ${options.method || "GET"} ${endpoint}:`,
            error
        )
        throw error
    }
}
function decodeUnicode(str: string) {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) =>
        String.fromCharCode(parseInt(match.replace("\\u", ""), 16))
    )
}