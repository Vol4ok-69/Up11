const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function apiRequest(
    endpoint: string,
    method: string,
    body?: any
) {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
        let message = `Request failed with status ${res.status}`

        try {
            const errorJson = await res.json()
            message =
                errorJson.error ||
                errorJson.message ||
                JSON.stringify(errorJson)
        } catch {
            const text = await res.text()
            message = text || message
        }

        throw new Error(message)
    }

    const text = await res.text()

    if (!text) {
        return null
    }

    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}