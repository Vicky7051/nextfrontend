
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { LoginData } from '@/app/auth/login/page'
import { AddUser, UpdateSalaryRequest } from '@/app/users/page'
import { RootState } from './Store'


export const BASE_URL = 'https://nextbackend-0gw6.onrender.com'
export const FRONTEND_BASE_URL = 'http://localhost:3000/api'
// export const BASE_URL = "http://localhost:4000"


export interface ErrorResponse  {
    message: string,
    error: string,
    statusCode: number
}

export interface CookiesData {
    authToken : string
    role : string
}

const initialState = {
    profile : {
        token : '',
        data : {},
        isLoading : false,
        isError : false,
        error : "",
        success : false
    },
    user : {
        data : Array<any>(),
        isLoading : false,
        isError : false,
        error : "",
        success : false,
        pagination : {}
    },
    isLogout : false,
    addUser : {
        success : false,
        isLoading : false,
        isError : false,
        error : ''
    },
    deleteUser : {
        success : false,
        isLoading : false,
        isError : false,
        error : ''
    },
    salaryRequest : {
        requestSuccess : false,
        requestIsLoading : false,
        requestIsError : false,
        requestError : ''
    },
    approval : {
        data : [],
        approvalIsLoading : false,
        approvalSuccess : false,
        approvalIsError : false,
        approvalError : '',
        pagination : {}
    },
    approvalSalary : {
        approvalStatusIsLoading : false,
        approvalStatusSuccess : false,
        approvalStatusIsError : false,
        approvalStatusError : ''
    },
    rejectSalary : {
        rejectSalaryIsLoading : false,
        rejectSalarySuccess : false,
        rejectSalaryIsError : false,
        rejectSalaryError : ''
    },
    updateUser : {
        updateUserIsLoading : false,
        updateUserSuccess : false,
        updateUserIsError : false,
        updateUserError : ''
    },
    requestLogs : {
        data : [],
        requestLogsIsLoading : false,
        requestLogsSuccess : false,
        requestLogsIsError : false,
        requestLogsError : ''
    },
    autoLogin : {
        isAutoLoginLoading : false,
        isAutoLoginSuccess : false,
        isAutoLoginError : false,
        autoLoginError : ''
    }
}

export const LOGIN_USER = createAsyncThunk('auth/login', async (loginData: LoginData, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${BASE_URL}/auth/login`, loginData, {
          withCredentials: true,
        });
        return response.data;
      } catch (err : any) {
        console.log(err)
        return rejectWithValue(err.response ? err.response.data : err.message);
      }
    }
)

export const SET_COOKIES_FOR_FRONTEND = createAsyncThunk('cookies/save',  async (cookiesData: CookiesData, { rejectWithValue }) => {
    try{
        const response = await axios.post(`${FRONTEND_BASE_URL}/login`, cookiesData, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message)
    }
})

export const GET_USER_LIST = createAsyncThunk('user/getUser', async(pagination : any, { rejectWithValue }) => {
    const {pageNumber, noOfRows} = pagination
    try{
        const response = await axios.get(`${BASE_URL}/users/getAll/${pageNumber}/${noOfRows}`, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const AUTO_LOGIN = createAsyncThunk('auth/autoLogin', async(_, { rejectWithValue }) => {
    try{
        const response = await axios.get(`${BASE_URL}/auth/autoLogin`, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const LOGOUT_USER = createAsyncThunk('auth/logout', async(_, {rejectWithValue}) => {
    try{
        const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
            withCredentials : true
        })

        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const ADD_USER = createAsyncThunk('/user/new', async(userData : AddUser, {rejectWithValue}) => {
    try{
        const response = await axios.post(`${BASE_URL}/users`, userData, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const DELETE_USER = createAsyncThunk('/user/delete', async( id : string, {rejectWithValue}) => {
    try{
        const reponse = await axios.delete(`${BASE_URL}/users/${id}`, {
            withCredentials : true
        })
        return reponse.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})


export const SEARCH_USER = createAsyncThunk('search/user', async(info : any, {rejectWithValue}) => {
    const {query, pageNumber, noOfRows} = info
    try{
        const response = await axios.get(`${BASE_URL}/users/search/${query}/${pageNumber}/${noOfRows}`, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const REQUEST_FOR_SALARY_INCREASE_APPROVAL = createAsyncThunk('salary/approcal/request', async(info : UpdateSalaryRequest, {rejectWithValue}) => {
    try{
        const response = await axios.post(`${BASE_URL}/salaryapproval`, info, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const GET_APPROVAL_LIST = createAsyncThunk('salary/approval', async(pagination : any, {rejectWithValue}) => {
    try{
        const {pageNumber, noOfRows} = pagination
        const response = await axios.get(`${BASE_URL}/salaryapproval/${pageNumber}/${noOfRows}`, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const APPROVE_REQUEST = createAsyncThunk('salary/approval/approve', async(id : string, {rejectWithValue}) => {
    try{
        const response = await axios.put(`${BASE_URL}/salaryapproval/${id}`, {}, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const REJECT_SALARY_REQUEST = createAsyncThunk('salary/approval/reject', async(info : any, {rejectWithValue}) => {
    try{
        const {selectedId, reason} = info
        const response = await axios.put(`${BASE_URL}/salaryapproval/reject/${selectedId}`, reason, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})


export const UPDATE_USER = createAsyncThunk('user/update', async(data : any, {rejectWithValue}) => {
    const {id, selectedUser} = data
    try{
        const response = await axios.put(`${BASE_URL}/users/${id}`, selectedUser, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})


export const GET_LOGS = createAsyncThunk('get/logs', async(_, {rejectWithValue}) => {
    try{
        const response = await axios.get(`${BASE_URL}/salaryapproval/rejectedLogs`, {
            withCredentials : true
        })
        return response.data
    }
    catch(err : any){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})

export const storeSlice = createSlice({
    name : "store",
    initialState,
    reducers : {
        resetFlagsReducer : (state: RootState) => {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    isLoading: false,
                    isError: false,
                    success: false,
                },
                user: {
                    ...state.user,
                    isLoading: false,
                    isError: false,
                    success: false,
                },
                isLogout: false,
                addUser: {
                    ...state.addUser,
                    isLoading: false,
                    isError: false,
                    success: false,
                },
                deleteUser: {
                    ...state.deleteUser,
                    isLoading: false,
                    isError: false,
                    success: false,
                },
                salaryRequest: {
                    ...state.salaryRequest,
                    requestIsLoading: false,
                    requestIsError: false,
                    requestSuccess: false,
                },
                approval: {
                    ...state.approval,
                    approvalIsLoading: false,
                    approvalIsError: false,
                    approvalSuccess: false,
                },
                approvalSalary: {
                    ...state.approvalSalary,
                    approvalStatusIsLoading: false,
                    approvalStatusIsError: false,
                    approvalStatusSuccess: false,
                },
                rejectSalary: {
                    ...state.rejectSalary,
                    rejectSalaryIsLoading: false,
                    rejectSalaryIsError: false,
                    rejectSalarySuccess: false,
                },
                updateUser: {
                    ...state.updateUser,
                    updateUserIsLoading: false,
                    updateUserIsError: false,
                    updateUserSuccess: false,
                },
                requestLogs : {
                    ...state.requestLogs,
                    requestLogsIsLoading : false,
                    requestLogsSuccess : false,
                    requestLogsIsError : false
                },
                autoLogin : {
                    ...state.autoLogin,
                    isAutoLoginLoading : false,
                    isAutoLoginSuccess : false,
                    isAutoLoginError : false
                }
            }
        } 
    },
    extraReducers: (builder) => {
        builder
            .addCase(LOGIN_USER.pending, (state) => {
                state.profile.isLoading = true;
                state.profile.isError = false;
                state.profile.success = false;
            })
            .addCase(LOGIN_USER.fulfilled, (state, actions) => {
                state.profile.data = actions.payload.user;
                state.profile.isLoading = false;
                state.profile.isError = false;
                state.profile.error = "";
                state.profile.success = true;
                state.isLogout = false;
                state.profile.token = actions.payload.token
            })
            .addCase(LOGIN_USER.rejected, (state, actions: any) => {
                state.profile.isLoading = false;
                state.profile.isError = true;
                state.profile.error = actions.payload?.message || actions.error?.message || 'An error occurred';
                state.profile.success = false;
            })
            .addCase(LOGOUT_USER.fulfilled, (state) => {
                state.isLogout = true,
                state.profile.data = {}
            })

            .addCase(GET_USER_LIST.pending, (state) => {
                state.user.isLoading = true;
            })
            .addCase(GET_USER_LIST.fulfilled, (state, actions) => {
                state.user.isLoading = false;
                state.user.isError = false;
                state.user.success = true;
                state.user.data = actions.payload.data;
                state.user.pagination = actions.payload.pagination;
            })
            .addCase(GET_USER_LIST.rejected, (state, actions: any) => {
                state.user.isLoading = false;
                state.user.success = false;
                state.user.isError = true;
                state.user.error = actions.payload?.message || 'User not found.';
            })
            
            .addCase(AUTO_LOGIN.pending, (state) => {
                state.autoLogin.isAutoLoginLoading = true
            })
            .addCase(AUTO_LOGIN.fulfilled, (state, actions) => {
                state.profile.data = actions.payload.user;
                state.autoLogin.isAutoLoginLoading = false
                state.autoLogin.isAutoLoginSuccess = true
            })
            .addCase(AUTO_LOGIN.rejected, (state, actions: any) => {
                state.autoLogin.isAutoLoginLoading = false
                state.autoLogin.isAutoLoginError = true
                state.autoLogin.autoLoginError = actions.payload?.message || 'Login failed.';
            })
            .addCase(ADD_USER.pending, (state) => {
                state.addUser.isLoading = true;
            })
            .addCase(ADD_USER.fulfilled, (state, actions: any) => {
                state.addUser.success = true;
                state.addUser.isLoading = false;
                state.user.data.push(actions.payload.user);
            })
            .addCase(ADD_USER.rejected, (state, actions: any) => {
                state.addUser.isLoading = false;
                state.addUser.isError = true;
                state.addUser.error = actions.payload?.message || 'An error occurred.';
            })
            
            .addCase(SEARCH_USER.fulfilled, (state, actions) => {
                state.user.data = actions.payload.user.data
                state.user.pagination = actions.payload.user.pagination
            })
            .addCase(SEARCH_USER.rejected, (state) => {
                state.user.data = []
            })

            .addCase(DELETE_USER.fulfilled, (state, actions) => {
                state.deleteUser.success = true
                state.user.data = state.user.data.filter((item : any) => item._id !== actions.payload.user._id)
                state.deleteUser.isError = false
                state.deleteUser.isLoading = false
            })
            .addCase(DELETE_USER.pending, (state) => {
                state.deleteUser.success = false
                state.deleteUser.isError = false
                state.deleteUser.isLoading = true
            })
            .addCase(DELETE_USER.rejected, (state, actions: any) => {
                state.deleteUser.success = false;
                state.deleteUser.isError = true;
                state.deleteUser.isLoading = false;
                state.deleteUser.error = actions.payload?.message || 'An error occurred.';
            })
            .addCase(REQUEST_FOR_SALARY_INCREASE_APPROVAL.pending, (state) => {
                state.salaryRequest.requestIsLoading = true
            })
            .addCase(REQUEST_FOR_SALARY_INCREASE_APPROVAL.fulfilled, (state) => {
                state.salaryRequest.requestIsLoading = false
                state.salaryRequest.requestSuccess = true
            })
            .addCase(REQUEST_FOR_SALARY_INCREASE_APPROVAL.rejected, (state, actions: any) => {
                state.salaryRequest.requestIsLoading = false;
                state.salaryRequest.requestSuccess = false;
                state.salaryRequest.requestIsError = true;
                state.salaryRequest.requestError = actions.payload?.message || 'An error occurred.';
            })
            
            .addCase(GET_APPROVAL_LIST.pending, (state) => {
                state.approval.approvalIsLoading = true
            })
            .addCase(GET_APPROVAL_LIST.fulfilled, (state, actions) => {
                state.approval.approvalIsLoading = false
                state.approval.approvalSuccess = true,
                state.approval.data = actions.payload.data
                state.approval.pagination = actions.payload.pagination
            })
            .addCase(GET_APPROVAL_LIST.rejected, (state, actions: any) => {
                state.approval.approvalIsLoading = false;
                state.approval.approvalIsError = true;
                state.approval.approvalError = actions.payload?.message || 'An error occurred.';
            })
            .addCase(APPROVE_REQUEST.pending, (state) => {
                state.approvalSalary.approvalStatusIsLoading = true;
                state.approvalSalary.approvalStatusIsError = false;
                state.approvalSalary.approvalStatusSuccess = false;
            })
            .addCase(APPROVE_REQUEST.fulfilled, (state) => {
                state.approvalSalary.approvalStatusIsLoading = false;
                state.approvalSalary.approvalStatusSuccess = true;
            })
            .addCase(APPROVE_REQUEST.rejected, (state, actions: any) => {
                state.approvalSalary.approvalStatusIsLoading = false;
                state.approvalSalary.approvalStatusIsError = true;
                state.approvalSalary.approvalStatusError = actions.payload?.message || 'An error occurred.';
            })
            
            .addCase(REJECT_SALARY_REQUEST.pending, (state) => {
                state.rejectSalary.rejectSalaryIsLoading = true;
            })
            .addCase(REJECT_SALARY_REQUEST.fulfilled, (state) => {
                state.rejectSalary.rejectSalaryIsLoading = false;
                state.rejectSalary.rejectSalarySuccess = true;
            })
            .addCase(REJECT_SALARY_REQUEST.rejected, (state, actions: any) => {
                state.rejectSalary.rejectSalaryIsLoading = false;
                state.rejectSalary.rejectSalaryIsError = true;
                state.rejectSalary.rejectSalaryError = actions.payload?.message || 'An error occurred.';
            })
            
            .addCase(UPDATE_USER.pending, (state) => {
                state.updateUser.updateUserIsLoading = true;
                state.updateUser.updateUserIsError = false;
                state.updateUser.updateUserSuccess = false;
            })
            .addCase(UPDATE_USER.fulfilled, (state) => {
                state.updateUser.updateUserIsLoading = false;
                state.updateUser.updateUserSuccess = true;
            })
            .addCase(UPDATE_USER.rejected, (state, actions: any) => {
                state.updateUser.updateUserIsLoading = false;
                state.updateUser.updateUserIsError = true;
                state.updateUser.updateUserError = actions.payload?.message || 'An error occurred.';
            })
            .addCase(GET_LOGS.pending, (state) => {
                state.requestLogs.requestLogsIsLoading = true
            })
            .addCase(GET_LOGS.fulfilled, (state, actions) => {
                state.requestLogs.requestLogsIsLoading = false,
                state.requestLogs.requestLogsSuccess = true, 
                state.requestLogs.data = actions.payload.approval
            })
            .addCase(GET_LOGS.rejected, (state, actions : any) => {
                state.requestLogs.requestLogsIsLoading = false,
                state.requestLogs.requestLogsIsError = true,
                state.requestLogs.requestLogsError = actions?.payload?.message || "An error occurred."
            })
            
    }
})

export const {resetFlagsReducer} = storeSlice.actions

// export default storeSlice.reducer