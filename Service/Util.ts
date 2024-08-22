export const onlyNumber = (value: string) => {
    return /^\d*\.?\d*$/.test(value)
}

export const validatePassword = (password : any) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

    if (regex.test(password)) {
        return true; 
    } else {
        return false;
    }
}