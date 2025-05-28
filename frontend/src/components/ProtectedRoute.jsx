import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({children}){
    const {user, authLoading}=useAuth()
    const navigate = useNavigate()

    if (authLoading) return <p className="text-center mt-10">Checking Session...</p>
    if (!user) {
        navigate("/login")
        return null
    }
    return children
}