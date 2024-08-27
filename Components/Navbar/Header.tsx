"use client"

import { AppDispatch, RootState } from "@/Service/Redux/Store"
import { AUTO_LOGIN, resetFlagsReducer } from "@/Service/Redux/StoreSlice"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

export const getHeading = (role : string = "") => {
    return role.split('_').map((item) => item.charAt(0).toUpperCase()+(item.slice(1).toLowerCase())).join(' ')
}

const Header = () => {

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()
    const { data, isLoading, isError, error, success } = useSelector((state : RootState) => state.profile)
    
    const {isAutoLoginLoading, isAutoLoginSuccess, isAutoLoginError, autoLoginError} = useSelector((state : RootState) => state.autoLogin)

    useEffect(() => {
        dispatch(AUTO_LOGIN())
    }, [])

    useEffect(() => {
        if(isAutoLoginError){
            // toast.warn(autoLoginError)
            router.push('/auth/login')
            dispatch(resetFlagsReducer())
        }
        dispatch(resetFlagsReducer())
    }, [isAutoLoginError, autoLoginError])

    return (
        <h1 className="text-white text-3xl font-bold text-center" style={{padding: "40px 0px"}}>{getHeading(data.role ? data.role : "")}</h1>
    )
}

export default Header