import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { SignJWT } from 'jose';
import dbConnect from '@/config/db';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new NextResponse('Email and password are required', { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return new NextResponse('Invalid email format', { status: 400 });
    }

    if(password.length < 6){
        return new NextResponse('Password must be at least 6 characters long', { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
        return new NextResponse('Invalid email or password', { status: 406 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return new NextResponse('Invalid email or password', { status: 406 });
    }

    const token = await new SignJWT({
        id: user._id.toString(),
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(Math.floor(Date.now() / 1000) + 3 * 30 * 24 * 60 * 60) // 6 months
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return NextResponse.json({ message: 'Login successful', user: { name: user.name, email: user.email, imgSrc: user.imgSrc }, token });
}