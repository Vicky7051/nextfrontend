"use client"

import { RootState } from "@/Service/Redux/Store"
import { useSelector } from "react-redux"
import { getHeading } from "../../Components/Navbar/Header"
import { useEffect, useLayoutEffect } from "react"
import { useRouter } from "next/navigation"

const allowed = ['ADMIN', 'MANAGER', 'TEAM_LEADER', 'EMPLOYEE']

const page = () => {
    const profile = useSelector((state : RootState) => state.profile.data)
    const router = useRouter()

    useLayoutEffect(() => {
        if(!allowed.includes(profile.role)) router.push('auth/login')
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