"use client"
import { AppDispatch, RootState } from '@/Service/Redux/Store'
import { LOGOUT_USER, resetFlagsReducer } from '@/Service/Redux/StoreSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const NavbarTop = () => {
    const [isDrop, setIsDrop] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const isLogout = useSelector((state : RootState) => state.isLogout)

    const router = useRouter()

    const onClickLogoutHandler = () => {
        dispatch(LOGOUT_USER())
        setIsDrop(false)
    }

    useEffect(() => {
        if(isLogout){
            toast.success("Logout Successfully.")
            setTimeout(() => {
                router.push('/auth/login')
            }, 200)
        }
        dispatch(resetFlagsReducer())
    }, [isLogout])

    const goToProfile = () => {
        router.push('/profile')
        setIsDrop(false)
        dispatch(resetFlagsReducer())
    }

    return (
        <div className='w-full h-[60px] bg-sky-950 flex px-10 justify-between' style={{justifyContent: "space-between"}}>
            <div></div>
            <div className='flex items-center h-full' style={{height: "60px"}}>
                <FaRegUser className='text-white text-3xl bg-black p-2 rounded-full w-[40px] h-[40px] cursor-pointer userIcon' onClick={e => setIsDrop(!isDrop)}/>
                {isDrop && <div className='dropDown absolute bg-gray-500 rounded' style={{position : "absolute", right : "0px", top: "60px", background : 'gray'}}>
                    <ul>
                        <li className='px-10 py-2 hover:bg-white hover:cursor-pointer' onClick={goToProfile}>Profile</li>
                        <li className='px-10 py-2 hover:bg-white hover:cursor-pointer' onClick={onClickLogoutHandler}>Logout</li>
                    </ul>
                </div>}
            </div>
        </div>
    )
}

export default NavbarTop