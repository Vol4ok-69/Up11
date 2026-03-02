const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function apiRequest(
    endpoint: string,
    method: string,
    body?: any
) {
    const token = typeof window !== "undefined"
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
        throw new Error(await res.text())
    }

    return res.json()
}