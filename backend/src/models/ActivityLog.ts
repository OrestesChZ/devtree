import mongoose, { Schema, Document } from 'mongoose'

export interface IActivityLog extends Document {
    user: mongoose.Types.ObjectId
    action: string
    linkName: string
    oldValue?: string
    newValue?: string
    createdAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    linkName: {
        type: String,
        required: true
    },
    oldValue: String,
    newValue: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)
