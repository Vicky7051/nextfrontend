"use client"
import { useState } from "react"

type Props = {
    role : string
    pathname : string
}
const useProtectedRoute = ({role, pathname} : Props) => {
    const [allow, setAllow] = useState<boolean>(false)
    if(pathname === "/" || pathname === "/profile"){
        setAllow(['ADMIN', "MANAGER", "TEAM_LEADER", "EMPLOYEE"].includes(role))
    }
    else if(['/approval', '/salary', '/users'].includes(pathname)){
        setAllow(['ADMIN', "MANAGER", "TEAM_LEADER"].includes(role))
    }
    else if(pathname === "/logs"){
        setAllow(["MANAGER", "TEAM_LEADER", "EMPLOYEE"].includes(role))
    }
    return allow
}

export default useProtectedRoute