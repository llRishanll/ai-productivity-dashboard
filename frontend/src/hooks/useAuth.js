import {useState, useEffect} from "react"
import { getCurrentUser } from "../api/auth"

export default function useAuth() {
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(()=>{
        getCurrentUser().then((data)=>{setUser(data)})
        .catch(()=>{setUser(null)})
        .finally(()=>{setAuthLoading(false)});
    }, [])
    return {user, authLoading};
}