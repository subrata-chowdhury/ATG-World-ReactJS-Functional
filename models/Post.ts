import mongoose, { Schema, Document } from 'mongoose';

export interface PostType extends Document {
    postImg?: string;
    type: string;
    title: string;
    description?: string;
    location?: string;
    date?: string;
    company?: string;
    author: mongoose.Types.ObjectId;
    views: number;
    btns?: {
        name: string;
        color: string;
        link?: string;
    }[];
    likedBy?: mongoose.Types.ObjectId[];
    comments?: mongoose.Types.ObjectId[];
}

const BtnSchema = new Schema(
    {
        name: { type: String, required: true },
        color: { type: String, required: true },
        link: { type: String },
    },
    { _id: false }
);

const PostSchema = new Schema<PostType>({
    postImg: { type: String },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    date: { type: String },
    company: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    views: { type: Number, default: 0 },
    btns: { type: [BtnSchema] },
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', default: [] },
}, { collection: 'posts', timestamps: true });

const Post = mongoose.models.Post || mongoose.model<PostType>('Post', PostSchema);

export default Post;