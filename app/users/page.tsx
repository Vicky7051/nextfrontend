"use client"
import { AppDispatch, RootState } from "@/Service/Redux/Store"
import { ADD_USER, BASE_URL, DELETE_USER, GET_USER_LIST, REQUEST_FOR_SALARY_INCREASE_APPROVAL, resetFlagsReducer, SEARCH_USER, UPDATE_USER } from "@/Service/Redux/StoreSlice"
import { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import BasicTable from "../../Components/Tables/BasicTable"
import Modal from 'react-modal'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md"
import axios from "axios"
import { toast } from "react-toastify"
import Searchbox from "@/Components/Searchbox"
import { onlyNumber, validatePassword } from "@/Service/Util"
Modal.setAppElement("#root");


export interface AddUser {
    name : string,
    email : string,
    password : string,
    isActive : boolean,
    role : string,
    reportingManager? : string,
    teamLeader? : string,
    salary : string
}

export interface UpdateSalaryRequest {
    userId : string,
    amount : string
}



const page = () => {

    const dispatch = useDispatch<AppDispatch>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

    const {data, pagination} = useSelector((state : RootState) => state.user)
    const profile = useSelector((state : RootState) => state.profile.data)
    const [manager, setManager] = useState<any>()
    const [teamLeader, setTeamLeader] = useState<any>()

    const getAllData = async() => {
        const response = await axios.get(`${BASE_URL}/users/getAllManager`, {
            withCredentials : true
        })
        setManager(response.data)

        const data = await axios.get(`${BASE_URL}/users/getAllTeamLeader`, {
            withCredentials : true
        })
        setTeamLeader(data.data)
    }   
    
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [noOfRows, setNoOfRows] = useState<number>(10)


    useEffect(() => {
        dispatch(GET_USER_LIST({pageNumber, noOfRows}))
        getAllData()
    }, [])

    const columns = [
        {
            Header : "Name",
            accessor : "name"
        },
        {
            Header : "Email",
            accessor : "email"
        },
        {
            Header : "Role",
            accessor : "role"
        },
        {
            Header : "Salary",
            accessor : 'salary[0].amount'
        },
        {
            Header : "Reporting Manager",
            accessor : "reportingManagerDetails[0].name"
        },
        {
            Header : "Team Leader",
            accessor : "teamLeaderDetails[0].name"
        },
        {
            Header : "Action",
            Cell: (row : any) => <div className="w-full flex items-center justify-center gap-5">
                <MdOutlineModeEdit className="text-blue-600 text-2xl hover:text-blue-950 transition-all cursor-pointer" onClick={() => handleEdit(row)}/>
                <MdDeleteOutline className="text-red-600 text-2xl hover:text-red-900 transition-all cursor-pointer" onClick={() => handleDelete(row)}/>
            </div>
        }
    ]

    // const options = ["ADMIN", "MANAGER", "TEAM_LEADER", "EMPLOYEE"]
    const [options, setOptions] = useState<string[]>([]);
    useEffect(() => {
        if(profile.role === "ADMIN"){
            setOptions(["MANAGER", "TEAM_LEADER", "EMPLOYEE"]);
        }
        else if(profile.role === "MANAGER"){
            setOptions(["TEAM_LEADER", "EMPLOYEE"]);
        } 
        else if(profile.role === "TEAM_LEADER"){
            setOptions(['EMPLOYEE']);
        }
    }, [profile.role]);


    const initalData = {
        name : "",
        email : "",
        password : "",
        isActive : false,
        role : "",
        reportingManager : "",
        teamLeader : "",
        salary : ""
    }
    const [user, setUser] = useState<any>(initalData)

    const onChangeHandler = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(e.target.name === "salary"){
            if(onlyNumber(e.target.value)) {
                setUser((prev: any) => ({
                    ...prev,
                    [e.target.name]: e.target.value
                }));
            }
        }
        else{
            setUser((prev: any) => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    }

    const onClickSubmitBtn = async(e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!validatePassword(user.password)){
            toast.warn("Password contain atleast One Uppercase, Lowercase, digit, spacial char.")
            return
        }
        await dispatch(ADD_USER(user))
    }

    const {isLoading, isError, error, success} = useSelector((state : RootState) => state.addUser)

    useEffect(() => {
        if(success){
            toast.success("User Added successfully")
            setIsOpenModal(false)
            setUser(initalData)
            dispatch(GET_USER_LIST({pageNumber, noOfRows}))
            getAllData()
        }
        if(isError){
            toast.warn(error)
        }
        dispatch(resetFlagsReducer())
    }, [isLoading, isError, success, dispatch, error])

    const [searchText, setSearchText] = useState<string>('')

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

    const { success : deleteSuccess , isLoading: deleteIsLoading, isError: deleteIsError, error : deleteError} = useSelector((state : RootState) => state.deleteUser)
    const [selectedUser, setSelectedUser] = useState<any>()
    const [copyOfSelectedUser, setCopyOfSelectedUser] = useState<any>()


    const handleEdit = (row: any) => {
        const {_id} = row.row.original
        setIsEditModal(true)
        const selectUser = data.find((item : any) => item._id === _id)
        setSelectedUser(selectUser)
        setCopyOfSelectedUser(selectUser)
      };
      
      const handleDelete = async(row: any) => {
        const {_id} = row.row.original
        await dispatch(DELETE_USER(_id))
      };


      useEffect(() => {
        if(deleteSuccess){
            toast.success("User Deleted successully.")
            dispatch(GET_USER_LIST({pageNumber, noOfRows}))
            getAllData()
        }
        else if(deleteIsError){
            toast.warn(deleteError)
        }
        dispatch(resetFlagsReducer())
      }, [deleteSuccess, deleteError, deleteIsLoading, deleteIsError, dispatch])

      const [isEditModal, setIsEditModal] = useState<boolean>(false)

      const onChangeEditInputHandler = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSelectedUser({
            ...selectedUser,
            [e.target.name] : e.target.value
        })
        if(e.target.name === "role"){
            setSelectedUser({
                ...selectedUser,
                [e.target.name] : e.target.value,
                reportingManager : copyOfSelectedUser.reportingManager,
                teamLeader : copyOfSelectedUser.teamLeader
            })
        }
        if(e.target.name === "role" && e.target.value === "ADMIN"){
            setSelectedUser({
                ...selectedUser,
                [e.target.name] : e.target.value,
                reportingManager : null,
                teamLeader : null
            })
        }
        if(e.target.name === "role" && e.target.value === "MANAGER"){
            setSelectedUser({
                ...selectedUser,
                [e.target.name] : e.target.value,
                reportingManager : null,
                teamLeader : null,
            })   
        }
      }

      const onClickEditSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(UPDATE_USER({id : selectedUser._id, selectedUser}))
      }

      const {
        updateUserIsLoading,
        updateUserSuccess,
        updateUserIsError,
        updateUserError
      } = useSelector((state: RootState) => state.updateUser) 

      const [isEditSalary, setIsEditSalary] = useState<boolean>(false)
      const [newSalary, setNewSalary] = useState<string>('')

      const onClickUpdateSalary = () => {
        setIsEditSalary(false)
        if(+newSalary > 0){
            const info : UpdateSalaryRequest = {
                userId : selectedUser._id,
                amount : newSalary
            }
            dispatch(REQUEST_FOR_SALARY_INCREASE_APPROVAL(info))
            toast.success("Salary approval request sended successfully.")
        }
      }

      useEffect(() => {
        if(updateUserSuccess){
            toast.success("User Updated.")
            dispatch(GET_USER_LIST({pageNumber, noOfRows}))
            setIsEditModal(false)
        }
        if(updateUserIsError){
            toast.warn(updateUserError)
        }
        dispatch(resetFlagsReducer())
      }, [updateUserIsLoading,updateUserSuccess,updateUserIsError, dispatch, updateUserError])



      const {requestSuccess, requestError, requestIsError, requestIsLoading} = useSelector((state : RootState) => state.salaryRequest)
      useEffect(() => {
        if(requestSuccess){
            toast.success("Salary Update Request sended.")
            setNewSalary('')
        }
        dispatch(resetFlagsReducer())
      }, [requestSuccess, requestIsError, requestIsLoading, dispatch])

      const handlePageChange = (val : number) => {
        setPageNumber(val)
      }
      useEffect(() => {
        if(searchText.length > 0) dispatch(SEARCH_USER({query : searchText, pageNumber, noOfRows}))
        else dispatch(GET_USER_LIST({pageNumber, noOfRows}))
      }, [pageNumber, noOfRows])

    return (
        <div>
            <Modal 
                isOpen={isOpenModal}
                onRequestClose={() => setIsOpenModal(false)}
            >
                <p className="flex justify-end"><IoIosCloseCircleOutline className="text-white text-3xl cursor-pointer" onClick={() => setIsOpenModal(false)} /></p>
                <h1 className="text-white text-3xl py-3">Add User</h1>
                {isError && <p className="text-red-600">{error}</p>}
                <form onSubmit={e => onClickSubmitBtn(e)}>
                    <div className="mt-3">
                        <input type="text" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Enter name" value={user.name} name="name" onChange={e => onChangeHandler(e)} required/>
                    </div>
                    <div className="mt-3">
                        <input type="email" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Enter email" name="email" value={user.email} onChange={e => onChangeHandler(e)} required/>
                    </div>
                    <div className="mt-3">
                        <input type="text" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Enter salary" name="salary" value={user.salary} onChange={e => onChangeHandler(e)} maxLength={8} required/>
                    </div>
                    <div className="mt-3">
                        <select className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" name="role" onChange={e => onChangeHandler(e)} value={user.role}>
                            <option value={''} disabled>Select Role Here</option>
                            {
                                options.map((item, idx) => <option className="text-black" value={item} key={idx}>{item}</option>)
                            }
                        </select>
                    </div>
                    {["EMPLOYEE", "TEAM_LEADER"].includes(user.role) && <div className="mt-3">
                        <select className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" name="reportingManager" onChange={e => onChangeHandler(e)} value={user.reportingManager}>
                            <option disabled value={''}>Select Manager</option>
                            {
                                manager.map((item : any) => item.role === "MANAGER" && <option value={item._id} className="text-black">{item.name}</option>)
                            }
                        </select>
                    </div>}

                    {["EMPLOYEE"].includes(user.role) && <div className="mt-3">
                        <select className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" name="teamLeader" onChange={e => onChangeHandler(e)} value={user.teamLeader}>
                            <option disabled value={''}>Select Team Leader</option>
                            {
                                teamLeader.map((item : any) => item.role === "TEAM_LEADER" && <option value={item._id} className="text-black">{item.name}</option>)
                            }
                        </select>
                    </div>}
                    <div className="mt-3">
                        <input type="password" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Plassword" name="password" value={user.password} onChange={e => onChangeHandler(e)} required/>
                    </div>
                    <div className="mt-5 flex gap-5 justify-end">
                        <button type="button" className="text-white py-2" onClick={() => setIsOpenModal(false)}>Cancel</button>
                        <button className="text-white border py-2 px-10 rounded-md hover:bg-slate-800 transition-all">Save</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isEditModal} onRequestClose={() => setIsEditModal(false)}>
                <p className="flex justify-end"><IoIosCloseCircleOutline className="text-white text-3xl cursor-pointer" onClick={() => setIsEditModal(false)} /></p>
                <h1 className="text-white text-3xl py-3">Edit User</h1>

                <form onSubmit={e => onClickEditSubmit(e)}>
                    <div className="mt-3">
                        <input type="text" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Enter name" value={selectedUser?.name} name="name" onChange={e => onChangeEditInputHandler(e)} required/>
                    </div>
                    <div className="mt-3">
                        <input type="email" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Enter email" name="email" value={selectedUser?.email} onChange={e => onChangeEditInputHandler(e)} required/>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <input type="text" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" placeholder="Enter salary" name="salary" value={selectedUser?.salary[0]?.amount} maxLength={8} readOnly/>
                        <button type="button" className="border text-white px-3" onClick={() => setIsEditSalary(true)}>Edit</button>
                    </div>

                    {isEditSalary && <div className="mt-3">
                        <h1 className="text-white text-xl text-left">Update Salary</h1>
                        <div className="mt-2">
                            <input type="text" placeholder="Enter new salary" className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" onChange={e => {
                                if(onlyNumber(e.target.value)){
                                    setNewSalary(e.target.value)
                                }
                            }} value={newSalary} maxLength={8}/>
                        </div>
                        <div className="mt-2 flex justify-end">
                            <button type="button" className="text-white border py-2 px-10 rounded-md hover:bg-slate-800 transition-all" onClick={onClickUpdateSalary}>Request</button>
                        </div>
                    </div>}

                    <div className="mt-3">
                        <select className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" name="role" onChange={e => onChangeEditInputHandler(e)} value={selectedUser?.role ? selectedUser?.role : ''}>
                            <option value={''} disabled>Select Role Here</option>
                            {
                                options.map((item, idx) => <option className="text-black" value={item} key={idx}>{item}</option>)
                            }
                        </select>
                    </div>
                    {["EMPLOYEE", "TEAM_LEADER"].includes(selectedUser?.role) && <div className="mt-3">
                        <select className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" name="reportingManager" onChange={e => onChangeEditInputHandler(e)} value={selectedUser?.reportingManager ? selectedUser?.reportingManager : ''}>
                            <option disabled value={''}>Select Manager</option>
                            {
                                manager.map((item : any) => item.role === "MANAGER" && <option value={item._id} className="text-black">{item.name}</option>)
                            }
                        </select>
                    </div>}

                    {["EMPLOYEE"].includes(selectedUser?.role) && <div className="mt-3">
                        <select className="w-full p-2 bg-transparent border rounded-sm text-white outline-none" name="teamLeader" onChange={e => onChangeEditInputHandler(e)} value={selectedUser?.teamLeader ? selectedUser?.teamLeader : ''}>
                            <option disabled value={''}>Select Team Leader</option>
                            {
                                teamLeader.map((item : any) => item.role === "TEAM_LEADER" && <option value={item._id} className="text-black">{item.name}</option>)
                            }
                        </select>
                    </div>}
                    <div className="mt-5 flex gap-5 justify-end">
                        <button type="button" className="text-white py-2" onClick={() => setIsEditModal(false)}>Cancel</button>
                        <button className="text-white border py-2 px-10 rounded-md hover:bg-slate-800 transition-all">Update</button>
                    </div>
                </form>


                
                

            </Modal>
            
            <Searchbox onSearchInput={onSearchInput} />
            <div className="mt-5">
                <BasicTable columns={columns} data={data} pagination={pagination} handlePageChange={handlePageChange} currentId={profile._id}/>
            </div>
            <button className="border py-2 px-10 bg-sky-950 text-white rounded-md hover:bg-blue-950 mt-5" onClick={() => setIsOpenModal(true)}>Add User</button>
        </div>
    )
}
export default page