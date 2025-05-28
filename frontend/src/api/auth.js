const baseUrl = import.meta.env.VITE_API_URL

export async function getCurrentUser() {
    const token = localStorage.getItem("token")
    if (!token) return null

    const response = await fetch(baseUrl + "/me",{
        headers: {
            "Authorization":`Bearer ${token}`,
        }
    })
    if (!response.ok) return null
    const user = await response.json()
    return user
}