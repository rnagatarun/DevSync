import validator from "validator";

interface SignUpRequestBody {
    firstName: string;
    lastName: string;
    emailId: string;
    password: string;
}

export const validateSignUpData = (req: { body: SignUpRequestBody }) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Credentials");
    }
     else if(validator.isStrongPassword(password)){
        throw new Error("Invalid Credentials");
    }
}