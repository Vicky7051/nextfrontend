import { LoginData } from "@/app/auth/login/page"
import axios from "axios"
import { BASE_URL, FRONTEND_BASE_URL } from "./Redux/StoreSlice";
import { error } from "console";

type customRequest = {
    authToken : string
    role : string
}

export const LOGIN_FOROM_CONTEXT = async(loginData : LoginData) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, loginData, {
          withCredentials: true,
        });
        return response.data;
    } 
    catch (err : any) {
        return err.response ? err.response.data : err.message;
    }
}