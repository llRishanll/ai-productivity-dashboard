const baseUrl = import.meta.env.VITE_API_URL

export default function Login(){
    const handleLogin = () => {
        window.location.href = `${baseUrl}/auth/google-login`
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <h1 className="text-3xl font-bold mb-6">Welcome to TaskMaster AI</h1>
            <button onClick={handleLogin} className="bg-blue-500 text-white px-6 py-3 rounded shadow-blue-950 hover:bg-blue-700 transition">
                Sign in with Google
            </button>
        </div>

    )
}