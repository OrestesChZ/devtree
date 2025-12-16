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
        clicks: number
    }[]
}

const userSchema = new Schema<IUser>({
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
                url: { type: String, default: '' },
                enabled: { type: Boolean, default: false },
                clicks: { type: Number, default: 0 } 
            }
        ],
        default: []
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User
