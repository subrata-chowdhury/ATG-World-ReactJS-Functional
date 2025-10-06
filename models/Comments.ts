import mongoose, { Schema, Document } from 'mongoose';

export interface CommentType extends Document {
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CommentSchema = new Schema<CommentType>({
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
}, { collection: 'comments', timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model<CommentType>('Comment', CommentSchema);

export default Comment;