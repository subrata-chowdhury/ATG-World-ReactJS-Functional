import dbConnect from '@/config/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import Comment from '@/models/Comments';
import User from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const comments = await Comment.find({ post: id })
            .limit(limit)
            .skip((page - 1) * limit)
            .populate('author', 'name imgSrc', User)
            .exec();

        const totalComments = await Comment.countDocuments();
        const totalPages = Math.ceil(totalComments / limit);
        return NextResponse.json({
            comments,
            pagination: {
                totalComments,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        }, { status: 200 });
    } catch (e) {
        console.log(e)
        return new NextResponse('Error fetching posts', { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await req.headers.get('x-user');
    const { text } = await req.json();

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }
    if (!text) {
        return new NextResponse('Comment text is required', { status: 400 });
    }

    try {
        await dbConnect();

        const newComment = new Comment({
            post: id,
            content: text,
            author: userId
        })
        await newComment.save();
        
        return new NextResponse('Comment added successfully', { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse("Unable to add comment, error: " + error);
    }
}