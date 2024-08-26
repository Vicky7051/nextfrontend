"use client"
import Loader from "@/Components/Loader/Loader";
import contextProvider from "@/Service/Context/context";
import { AppDispatch, RootState } from "@/Service/Redux/Store";
import { AUTO_LOGIN, resetFlagsReducer } from "@/Service/Redux/StoreSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const allowed = ['ADMIN', 'MANAGER', 'TEAM_LEADER', 'EMPLOYEE']

export default function Home() { 
  const dispatch = useDispatch<AppDispatch>()
  // const {profile, setProfile} = useContext(contextProvider)
  const router = useRouter()

  const { isError, isLoading, error: apiError, success, data : profile } = useSelector((state: RootState) => state.profile)

  const {isAutoLoginLoading} = useSelector((state : RootState) => state.autoLogin)

  useLayoutEffect(() => {
    if(profile && profile.role){
      if(!allowed.includes(profile.role)) router.push('auth/login')
    } 
  }, [profile])
  
  return (
    <div className="w-full h-full">
        <h2 className="text-[50px] flex w-full items-center justify-center">Welcome : {profile.name}</h2>
    </div>
  );
}
