import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Define interface for user methods
interface IUserMethods {
    getJWT(): Promise<string>;
    validatePassword(password: string): Promise<string>;
}

// Define interface for user document
interface IUser extends mongoose.Document {
    firstName: string;
    lastName?: string;
    emailId: string;
    password: string;
    age?: number;
    gender?: string;
    photoUrl: string;
    about: string;
    skills: string[];
}

// Define the User model type
type UserModel = mongoose.Model<IUser, object, IUserMethods>;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }

        }
    },
    password: {
        type: String,
        required: true,
        validate(value: string) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong Password: " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum:{
            values: ["Male", "Female", "Others"],
            message: `{VALUE} is incorrect status type`
        }
        // validate(value: string) {
        //     if (!["Male", "Female", "Others"].includes(value)) {
        //         throw new Error("Gender is not valid");
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value: string) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    },
},
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function (): Promise<string> {
    const token = await jwt.sign(
        { _id: this._id },
        process.env.VITE_JSON_TOKEN_KEY as string,
        { expiresIn: "1d" }
    );
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser: string) {
    const passwordHash = this.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid
};

//Compund Index for firstName and lastName to identify user quickly
userSchema.index({firstName: 1, lastName: 1});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
export type { IUser, IUserMethods };
export default User;