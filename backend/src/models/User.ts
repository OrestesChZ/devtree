import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    handle: string
    name: string
    email: string
    password: string
    description: string 
    image: string       
    links: {            
        name: string
        url: string
        enabled: boolean
    }[]
}

const userSchema = new Schema({
    handle: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: { 
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: [
            {
                name: { type: String, required: true },
                url: { type: String, required: false },
                enabled: { type: Boolean, default: false }
            }
        ],
        default: []
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User