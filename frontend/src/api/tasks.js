const baseUrl = import.meta.env.VITE_API_URL

export async function fetchTasks(){
    const token = localStorage.getItem("token")
    const response = await fetch(`${baseUrl}/tasks`, {
        method: "GET",
        headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
    })
    if (!response.ok) throw new Error("Failed to fetch tasks")
    return await response.json()
}

