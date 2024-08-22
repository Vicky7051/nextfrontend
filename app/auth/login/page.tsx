"use client"
import { AppState } from '@/Constent/Interface'
import contextProvider from '@/Service/Context/context'
import { AppDispatch, RootState } from '@/Service/Redux/Store'
import { LOGIN_USER, resetFlagsReducer } from '@/Service/Redux/StoreSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React, { ChangeEvent, FormEvent, useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export interface LoginData {
  email: string,
  password: string
}

const Page = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  
  const {setProfile} = useContext(contextProvider)
  
  const { isError, isLoading, error: apiError, success, data } = useSelector((state: RootState) => state.profile)
  
  const [user, setUser] = useState<LoginData>({
    email: "",
    password: ""
  })

  const [error, setError] = useState<string | null>(null)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user, 
      [e.target.name]: e.target.value
    })
  }

  const onClickLoginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await dispatch(LOGIN_USER(user))
  }

  useEffect(() => {
    if (success) {
      toast.success("Login Successfully.")
      setProfile(data)
      setTimeout(() => {
        router.push('/')
      }, 200)
    } else if (isError) {
      toast.warn(apiError)
    }
    dispatch(resetFlagsReducer())
  }, [success, isError, router, apiError, data, dispatch, setProfile])

  return (
    <div className='w-[100%] h-[100vh] flex items-center justify-center'>
      <div className='bg-blue-900 w-[500px] p-5 rounded-md'>
        <div className='heading'>
          <h1 className='text-5xl text-white text-center'>Login</h1>
        </div>
        <div className='form'>
          <form onSubmit={onClickLoginHandler}>
            <div className='w-full mt-5'>
              <input 
                type='email' 
                placeholder='Email' 
                name='email' 
                className='w-full p-2 text-black outline-none border-none' 
                onChange={onChangeHandler}
              />
            </div>
            <div className='w-full mt-5'>
              <input 
                type='password' 
                placeholder='Password' 
                name='password' 
                className='w-full p-2 text-black outline-none border-none' 
                onChange={onChangeHandler}
              />
            </div>
            {error && <p className='text-left mt-2 text-red-500'>{error}</p>}
            <div className='w-full mt-5 flex items-center justify-center'>
              <button 
                type='submit' 
                className='border-white border-2 px-10 py-2 text-white hover:text-black hover:bg-slate-300 transition-all'
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
