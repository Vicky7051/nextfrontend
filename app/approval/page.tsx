"use client"
import { AppDispatch, RootState } from "@/Service/Redux/Store"
import { APPROVE_REQUEST, GET_APPROVAL_LIST, REJECT_SALARY_REQUEST, resetFlagsReducer } from "@/Service/Redux/StoreSlice"
import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import BasicTable from "../../Components/Tables/BasicTable"
import { toast } from "react-toastify"
import Modal from 'react-modal'
import { IoIosCloseCircleOutline } from "react-icons/io"
import { useRouter } from "next/navigation"
Modal.setAppElement('#root')

export interface ReasonForRejection {
    reasonForRejection : string
}

export interface dateType {
    value : string
}


const allowed = ['ADMIN', 'MANAGER', 'TEAM_LEADER']

const page = () => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const [pageNumber, setPageNumber] = useState<number>(1)
    const [noOfRows, setNoOfRows] = useState<number>(10)

    const [isReasonModal, setIsReasonModal] = useState<boolean>(false)
    const [maxChar, setMaxChar] = useState<number>(200)
    const [reason, setReason] = useState<ReasonForRejection>({
        reasonForRejection : ''
    })
    const [selectedId, setSelectedId] = useState<string>('')

    const {data, pagination} = useSelector((state : RootState) => state.approval)
    const {data : profile, isLoading, isError, error} = useSelector((state : RootState) => state.profile)


    useLayoutEffect(() => {
        if(profile && profile.role){
          if(!allowed.includes(profile.role)) router.push('auth/login')
        } 
    }, [profile])

    useEffect(() => {
        dispatch(GET_APPROVAL_LIST({pageNumber, noOfRows}))
    }, [pageNumber, noOfRows, dispatch])

    const columns = [
        {
            Header : "Name",
            accessor : "user.name"
        },
        {
            Header : "Email",
            accessor : "user.email"
        },
        {
            Header : "Salary",
            accessor : "amount"
        },
        {
            Header : "Created At",
            accessor : "createdAt",
            Cell: ({ value } : dateType) => {
                const date = new Date(value);
                const day = ('0' + String(date.getDate())).slice(-2)
                const month = ('0' + String(date.getMonth() + 1)).slice(-2);
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            },
        },
        {
            Header : "Approval",
            Cell : (row : any) => <div className="w-full flex items-center justify-center gap-5">
                <button className="px-5 py-1 bg-red-500 rounded text-white hover:bg-red-800 transition-all" onClick={() => onClickRejectHandler(row)}>Reject</button>
                <button className="px-5 py-1 bg-green-500 rounded text-white hover:bg-green-800 transition-all" onClick={() => onClickApproveHandler(row)}>Approve</button>
            </div>
        }
    ]

    const onClickApproveHandler = (row : any) => {
        const {_id} = row?.row?.original
        dispatch(APPROVE_REQUEST(_id))
    }

    const onClickRejectHandler = (row : any) => {
        const {_id} = row.row.original
        setSelectedId(_id)
        setIsReasonModal(true)
    }

    const {
        approvalStatusIsLoading,
        approvalStatusSuccess,
        approvalStatusIsError
    } = useSelector((state : RootState) => state.approvalSalary)

    useEffect(() => {
        if(approvalStatusSuccess){
            toast.success("Approved")
            dispatch(GET_APPROVAL_LIST({pageNumber, noOfRows}))
            setSelectedId('')
            setReason({
                reasonForRejection : ''
            })
            setIsReasonModal(false)
        }
        dispatch(resetFlagsReducer())
    }, [approvalStatusIsLoading, approvalStatusSuccess, approvalStatusIsError, dispatch, pageNumber, noOfRows])

    const {
        rejectSalaryIsLoading,
        rejectSalarySuccess,
        rejectSalaryIsError
    } = useSelector((state : RootState) => state.rejectSalary)

    useEffect(() => {
        if(rejectSalarySuccess){
            toast.success("Salary Approval Rejected.")
            dispatch(GET_APPROVAL_LIST({pageNumber, noOfRows}))
        }
        if(rejectSalaryIsError){
            toast.warn("Internal server error.")
        }
        setIsReasonModal(false)
        dispatch(resetFlagsReducer())
    }, [rejectSalaryIsLoading,rejectSalarySuccess,rejectSalaryIsError,dispatch, pageNumber, noOfRows])

    const handlePageChange = (val : number) => {
        setPageNumber(val)
    }

    const onChangeReasonHandler = (e : ChangeEvent<HTMLTextAreaElement>) => {
        setReason({
            ...reason,
            [e.target.name] : e.target.value
        })
    }

    const onClickSubmitBtn = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(selectedId.length > 0){
            dispatch(REJECT_SALARY_REQUEST({selectedId, reason}))
        }
        else toast.warn("Please select user.")
    }

    return (
        <div>
            <Modal isOpen={isReasonModal} onRequestClose={() => setIsReasonModal(false)}>
            <p className="flex justify-end"><IoIosCloseCircleOutline className="text-white text-3xl cursor-pointer" onClick={() => setIsReasonModal(false)} /></p>
            <h2 className="text-xl text-white">Reason for Rejection</h2>
            <form onSubmit={e => onClickSubmitBtn(e)}>
                <div className="mt-3">
                    <textarea className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Reason." rows={5} maxLength={maxChar} name="reasonForRejection" onChange={e => onChangeReasonHandler(e)} required></textarea>
                    <p className="text-white flex justify-end">Remaining : {maxChar - reason.reasonForRejection.length} Character</p>
                </div>
                <div className="mt-5 flex gap-5 justify-end">
                    <button type="button" className="text-white py-2" onClick={() => setIsReasonModal(false)}>Cancel</button>
                    <button className="text-white border py-2 px-10 rounded-md hover:bg-slate-800 transition-all">Reject</button>
                </div>
            </form>
            </Modal>
            <h1 className="text-2xl">Approval</h1>
            <div className="mt-3">
                <BasicTable columns={columns} data={data} pagination={pagination} handlePageChange={handlePageChange}/>
            </div>
        </div>
    )
}

export default page