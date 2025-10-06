import dbConnect from '@/config/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    try {
        await dbConnect();
        const post = await Post.findById(id);
        if (!post) {
            return new NextResponse('Post not found', { status: 404 });
        }
        return NextResponse.json(post, { status: 200 });
    } catch (e) {
        console.log(e)
        return new NextResponse('Error fetching post details', { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await req.headers.get('x-user');

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const {
            postImg,
            type,
            title,
            description,
            location,
            date,
            company,
            btns
        } = await req.json();

        const updateFields: {
            postImg?: string;
            type: string;
            title: string;
            description?: string;
            location?: string;
            date?: string;
            company?: string;
            btns?: {
            name: string;
            color: string;
            link?: string;
            }[];
        } = {
            type,
            title,
        };

        if (postImg !== undefined) updateFields.postImg = postImg;
        if (description !== undefined) updateFields.description = description;
        if (location !== undefined) updateFields.location = location;
        if (date !== undefined) updateFields.date = date;
        if (company !== undefined) updateFields.company = company;
        if (btns !== undefined) updateFields.btns = btns;

        await Post.findOneAndUpdate(
            { _id: id, author: userId },
            updateFields
        );
        return new NextResponse('Post updated successfully', { status: 200 })
    } catch (error) {
        console.log(error);
        return new NextResponse("Unable to update post, error: " + error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await req.headers.get('x-user');

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        Post.deleteOne({ _id: id, author: userId });
        return new NextResponse("Post deleted successfully", { status: 200 })
    } catch (error) {
        console.log(error);
        return new NextResponse("Unable to delete post, error: " + error);
    }
}