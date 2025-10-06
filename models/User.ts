import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;

    imgSrc?: string;

    otp?: string;
    otpExpiry?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    imgSrc: { type: String, required: false },

    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
}, { collection: 'users', timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;