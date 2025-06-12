import mongoose from 'mongoose';
import validator from 'validator';

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
        required: true,
        validate(value: string) {
            if (!["Male", "Female", "Others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }

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

export const User = mongoose.model("User", userSchema);