"use client"
import Searchbox from "@/Components/Searchbox"
import BasicTable from "@/Components/Tables/BasicTable"
import { AppDispatch, RootState } from "@/Service/Redux/Store"
import { GET_USER_LIST, REQUEST_FOR_SALARY_INCREASE_APPROVAL, resetFlagsReducer, SEARCH_USER } from "@/Service/Redux/StoreSlice"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Modal from 'react-modal'
import { IoIosCloseCircleOutline } from "react-icons/io"
import { UpdateSalaryRequest } from "../users/page"
import { toast } from "react-toastify"
import { onlyNumber } from "@/Service/Util"

const page = () => {

    const dispatch = useDispatch<AppDispatch>()

    const {data, pagination} = useSelector((state : RootState) => state.user)

    const profile = useSelector((state : RootState) => state.profile.data)

    useEffect(() => {
        dispatch(GET_USER_LIST({pageNumber : 1, noOfRows : 10}))
    }, [])

    const columns = [
        {
            Header : "Name",
            accessor : "name"
        },
        {
            Header : "Email",
            accessor : 'email'
        },
        {
            Header : "Salary",
            accessor : "salary[0].amount"
        },
        {
            Header : "Update Salary",
            Cell : (row : any) => <div className="flex items-center">
                <button className="border px-5 py-1 bg-sky-950 text-white rounded" onClick={() => onClickUpdateButton(row)}>Update</button>
            </div>
        }
    ]

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<string>('')
    const [newSalary, setNewSalary] = useState<string>('')
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [noOfRows, setNoOfRows] = useState<number>(10)
    const [searchText, setSearchText] = useState<string>('')

    const onClickUpdateButton = (row : any) => {
        const {_id} = row.row.original 
        setSelectedId(_id)
        setIsModalOpen(true)
    }

    const handlePageChange = (val : number) => {
        setPageNumber(val)
      }

    let setTimmer: any = null
    const onSearchInput = (e : ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setSearchText(value)
        if(value.length <= 0){
            if(setTimmer){
                clearTimeout(setTimmer)
            }
            dispatch(GET_USER_LIST({pageNumber, noOfRows}))
        }
        else{
            if(setTimmer){
                clearTimeout(setTimmer)
            }
            setTimmer = setTimeout(() => {
                dispatch(SEARCH_USER({query : value, pageNumber, noOfRows}))
            }, 500)
        }
    }

    const {
        requestSuccess,
        requestIsLoading,
        requestIsError,
        requestError
    } = useSelector((state : RootState) => state.salaryRequest)

    const onClickSubmitBtn = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(+newSalary > 0){
            const info : UpdateSalaryRequest = {
                userId : selectedId,
                amount : newSalary
            }
            dispatch(REQUEST_FOR_SALARY_INCREASE_APPROVAL(info))
        }
    }

    useEffect(()  => {
        if(requestSuccess){
            if(profile.role === "ADMIN") toast.success("Salary Updated.")
            else toast.success("Salary approval request sended successfully.")
            dispatch(GET_USER_LIST({pageNumber, noOfRows}))
        }
        else if(requestIsError){
            toast.warn(requestError)
        }
        setIsModalOpen(false)
        dispatch(resetFlagsReducer())
    }, [requestSuccess,requestIsLoading,requestIsError])

    useEffect(() => {
        if(searchText.length > 0) dispatch(SEARCH_USER({query : searchText, pageNumber, noOfRows}))
        else dispatch(GET_USER_LIST({pageNumber, noOfRows}))
      }, [pageNumber, noOfRows])

      const onChangeNewSalaryHandler = (e : ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(onlyNumber(value)) setNewSalary(value)
      }


    return (
        <div className="w-full">

            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <p className="flex justify-end"><IoIosCloseCircleOutline className="text-white text-3xl cursor-pointer" onClick={() => setIsModalOpen(false)} /></p>

                <h2 className="text-xl text-white">Update Salary</h2>
                <form onSubmit={e => onClickSubmitBtn(e)}>
                    <div className="mt-2">
                        <input type="text" placeholder="Enter new salary" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" onChange={e => onChangeNewSalaryHandler(e)} value={newSalary} maxLength={8}/>
                    </div>
                    <div className="mt-5 flex gap-5 justify-end">
                        <button type="button" className="text-white py-2" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="text-white border py-2 px-10 rounded-md hover:bg-slate-800 transition-all">Update</button>
                    </div>
                </form>
            </Modal>

            <h1 className="text-xl font-bold">Salary</h1>
            <div className="mt-3">
                <Searchbox onSearchInput={onSearchInput} />
            </div>
            <div className="mt-3">
                <BasicTable columns={columns} data={data} pagination={pagination} handlePageChange={handlePageChange}/>
            </div>
        </div>
    )
}
export default page