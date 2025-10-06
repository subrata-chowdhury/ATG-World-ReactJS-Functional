import dbConnect from '@/config/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    const userId = await req.headers.get('x-user');

    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        const posts = await Post.find({ author: userId }).populate('author', 'name email imgSrc', User)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });


        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);
        return NextResponse.json({
            posts,
            pagination: {
                totalPosts,
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