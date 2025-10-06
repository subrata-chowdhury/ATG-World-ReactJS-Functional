import dbConnect from '@/config/db';
import Post, { PostType } from '@/models/Post';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import User from '@/models/User';
import { jwtVerify } from 'jose';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    let payload = null;
    if (token !== 'undefined' && token) {
        try {
            payload = await jwtVerify<{ id: string }>(token, new TextEncoder().encode(process.env.JWT_SECRET));
        } catch {
            payload = null
        }
    }
    const id = payload?.payload?.id;

    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        const posts = await Post.find().populate('author', 'name email imgSrc', User)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        interface PostWithIsLiked extends PostType {
            isLikedByUser: boolean;
        }

        const postsWithIsLiked: PostWithIsLiked[] = [];
        posts.forEach((post: PostType) => {
            let isLikedByUser = false;
            if (id && post.likedBy?.length) {
                for (let index = 0; index < post.likedBy.length; index++) {
                    console.log(post.likedBy[index].toString(), id);
                    if (post.likedBy[index].toString() === id) {
                        isLikedByUser = true;
                        break;
                    }
                }
            }
            postsWithIsLiked.push({
                ...post.toObject(),
                isLikedByUser,
            });
        });

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);
        return NextResponse.json({
            posts: postsWithIsLiked,
            pagination: {
                totalPosts,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
            isLoggedIn: !!id,
        }, { status: 200 });
    } catch (e) {
        console.log(e)
        return new NextResponse('Error fetching posts', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const id = await req.headers.get('x-user');

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const postDetails = await req.json();
        const post = new Post({ ...postDetails, author: id });
        await post.save();
        return new NextResponse('Post created successfully', { status: 200 })
    } catch (error) {
        console.log(error);
        return new NextResponse('Error creating post', { status: 500 });
    }
}