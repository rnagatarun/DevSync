import validator from "validator";

interface SignUpRequestBody {
    firstName: string;
    lastName: string;
    emailId: string;
    password: string;
}

interface EditProfileRequestBody {
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    gender?: string;
    age?: number;
    about?: string;
    skills?: string[];
}

interface EditProfileRequest {
    body: EditProfileRequestBody;
}

export const validateSignUpData = (req: { body: SignUpRequestBody }) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters");
    }
}

export const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
];

export const validateEditProfileData = (req: EditProfileRequest): boolean => {
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
}