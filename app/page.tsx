"use client"
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
  const {profile, setProfile} = useContext(contextProvider)
  const router = useRouter()

  const { isError, isLoading, error: apiError, success, data } = useSelector((state: RootState) => state.profile)

  useLayoutEffect(() => {
    if(!allowed.includes(profile.role)) router.push('auth/login') 
  }, [profile])
  
  useEffect(() => {
    dispatch(AUTO_LOGIN())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      setProfile(data)
    } else if (isError) {
      toast.warn(apiError)
    }
    dispatch(resetFlagsReducer())
  }, [success, isError, dispatch, data, apiError, setProfile])

  
  return (
    <div className="w-full h-full">
        <h2 className="text-[50px] flex w-full items-center justify-center">Welcome : {profile.name}</h2>
    </div>
  );
}
