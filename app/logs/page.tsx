"use client"
import BasicTable from "@/Components/Tables/BasicTable"
import { AppDispatch, RootState } from "@/Service/Redux/Store"
import { GET_LOGS, resetFlagsReducer } from "@/Service/Redux/StoreSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { dateType } from "../approval/page"
import { useRouter } from "next/navigation"

const page = () => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const {data, requestLogsIsLoading,requestLogsSuccess,requestLogsIsError} = useSelector((state : RootState) => state.requestLogs)

    const {profile} = useSelector((state : RootState) => state.profile)
    useEffect(() => {
        if(!["MANAGER", "TEAM_LEADER", "EMPLOYEE"].includes(profile.role)){
            router.push('/auth/login')
        }
    }, [profile])

    useEffect(() => {
        dispatch(GET_LOGS())
    }, [dispatch])

    useEffect(() => {
        dispatch(resetFlagsReducer())
    }, [requestLogsIsLoading,requestLogsSuccess,requestLogsIsError, dispatch])

    const columns = [
        {
            Header : "Date",
            accessor : "createdAt",
            Cell: ({ value } : dateType) => {
                const date = new Date(value);
                const day = ('0' + String(date.getDate())).slice(-2)
                const month = ('0' + String(date.getMonth() + 1)).slice(-2);
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            Header : "Salary",
            accessor : "amount"
        },
        {
            Header: "Manager Approved",
            accessor: 'isManagerApproved',
            Cell: ({ value }: { value: boolean }) => 
                value ? <p className="text-blue-600">Approved</p> : <p className="text-red-600">Pending</p>
        },
        {
            Header: "Admin Approved",
            accessor: 'isAdminApproved',
            Cell: ({ value }: { value: boolean }) => 
                value ? <p className="text-blue-600">Approved</p> : <p className="text-red-600">Pending</p>
        },
        {
            Header: "Status",
            accessor: 'isRejected',
            Cell: ({ value }: { value: boolean }) => 
                value ? <p className="text-blue-600">Rejected</p> : <p className="text-red-600">Pending</p>
        },
        {
            Header : "Reason",
            accessor : 'reasonForRejection'
        }
    ]

    
    return (
        <div>
            <h1 className="text-xl">Your Requests</h1>
            <div className="mt-3">  
                <BasicTable columns={columns} data={data} />
            </div>
        </div>
    )
}

export default page

