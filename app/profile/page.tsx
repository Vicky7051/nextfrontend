"use client"

import { RootState } from "@/Service/Redux/Store"
import { useSelector } from "react-redux"
import { getHeading } from "../../Components/Navbar/Header"
import { useEffect, useLayoutEffect } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/Components/Loader/Loader"

const allowed = ['ADMIN', 'MANAGER', 'TEAM_LEADER', 'EMPLOYEE']

const page = () => {
    const {data : profile, isLoading} = useSelector((state : RootState) => state.profile)
    const router = useRouter()

    useLayoutEffect(() => {
        if(profile && profile.role){
          if(!allowed.includes(profile.role)) router.push('auth/login')
        } 
    }, [profile])
    
    return (
        <div>
            <h1 className="text-2xl">Profile</h1>
            <div className="mt-3">
                <p>Name : {profile.name}</p>
                <p>Email : {profile.email}</p>
                <p>Role : {getHeading(profile.role)}</p>
                <p>Status : {profile.isActive ? "Active" : "Deactive"}</p>
                <p></p>
            </div>
        </div>
    )
}

export default page