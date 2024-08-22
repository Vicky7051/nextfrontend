"use client"
import React, { useState } from 'react'
import ContextProvider from './context'

type Props = {
  children : any
}

const contextProvider = ({children} : Props) => {

  const [profile, setProfile] = useState({})  

  return (
    <ContextProvider.Provider value={{profile, setProfile}} >
      {children}
    </ContextProvider.Provider>
  )
}

export default contextProvider