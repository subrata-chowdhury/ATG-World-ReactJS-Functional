import dbConnect from "@/config/db";
import Post, { PostType } from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await req.headers.get('x-user');

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const post = await Post.findOne({ _id: id, author: userId }) as unknown as PostType;
        let foundIndex = -1;
        for (let index = 0; index < (post.likedBy?.length || 0); index++) {
            if (post.likedBy?.[index].toString() === userId) {
                foundIndex = index;
                break;
            }
        }
        if (foundIndex !== -1) {
            post.likedBy?.splice(foundIndex, 1);
        } else {
            post.likedBy?.push(new mongoose.Types.ObjectId(userId));
        }
        await post.save();
        return new NextResponse('Post updated successfully', { status: 200 })
    } catch (error) {
        console.log(error);
        return new NextResponse("Unable to update post, error: " + error);
    }
}