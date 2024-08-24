"use client"

import { RootState } from "@/Service/Redux/Store"
import { useSelector } from "react-redux"
import { getHeading } from "../../Components/Navbar/Header"

const page = () => {
    const profile = useSelector((state : RootState) => state.profile.data)
    
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