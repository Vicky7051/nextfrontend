import { AppDispatch, RootState } from "@/Service/Redux/Store"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import Header from "./Header"

const LeftNavbar = () => {
    const pathname = usePathname()
    const profile = useSelector((state : RootState) => state.profile.data)
    
    return (
        <div className="w-full bg-sky-950 h-[100vh]">
            <Header />
            <div className="w-full">
                <ul>
                    <Link href="/"><li className={`py-3 px-5 hover:px-10 transition-all cursor-pointer text-white font-bold hover:bg-sky-900 ${pathname === "/" && 'active'}`}>Dashboard</li></Link>
                    {["ADMIN", "MANAGER", "TEAM_LEADER"].includes(profile.role) && <Link href='/users'><li className={`py-3 px-5 hover:px-10 transition-all cursor-pointer text-white font-bold hover:bg-sky-900 ${pathname === "/users" && 'active'}`}>Users</li></Link>}
                    {["ADMIN", "MANAGER"].includes(profile.role) && <Link href='/approval'><li className={`py-3 px-5 hover:px-10 transition-all cursor-pointer text-white font-bold hover:bg-sky-900 ${pathname === "/approval" && 'active'}`}>Approval</li></Link>}
                    {["ADMIN", "MANAGER", "TEAM_LEADER"].includes(profile.role) && <Link href='/salary'><li className={`py-3 px-5 hover:px-10 transition-all cursor-pointer text-white font-bold hover:bg-sky-900 ${pathname === "/salary" && 'active'}`}>Salary</li></Link>}
                    {["ADMIN", "MANAGER", "TEAM_LEADER", "EMPLOYEE"].includes(profile.role) && <Link href='/profile'><li className={`py-3 px-5 hover:px-10 transition-all cursor-pointer text-white font-bold hover:bg-sky-900 ${pathname === "/profile" && 'active'}`}>Profile</li></Link>}
                    {["MANAGER", "TEAM_LEADER", "EMPLOYEE"].includes(profile.role) && <Link href='/logs'><li className={`py-3 px-5 hover:px-10 transition-all cursor-pointer text-white font-bold hover:bg-sky-900 ${pathname === "/logs" && 'active'}`}>Logs</li></Link>}
                </ul>
            </div>
        </div>
    )
}

export default LeftNavbar