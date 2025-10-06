import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import User from '@/models/User';
import { SignJWT } from 'jose';
import dbConnect from '@/config/db';

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return new NextResponse('Username, Phone no and password are required', { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;

    if (!emailRegex.test(email)) {
        return new NextResponse('Invalid email format', { status: 400 });
    }

    if (!nameRegex.test(name)) {
        return new NextResponse('Invalid name format', { status: 400 });
    }

    if(password.length < 6){
        return new NextResponse('Password must be at least 6 characters long', { status: 400 });
    }

    await dbConnect();

    const hashedPassword = await hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return new NextResponse('User already exists. Please log in.', { status: 400 });
    }

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
    } catch {
        return new NextResponse('Error saving user', { status: 500 });
    }

    const token = await new SignJWT({
        id: newUser._id,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(Math.floor(Date.now() / 1000) + 3 * 30 * 24 * 60 * 60) // 6 months
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return NextResponse.json({ message: 'User signed up successfully', user: { name: newUser.name, email: newUser.email, imgSrc: newUser.imgSrc }, token });
}