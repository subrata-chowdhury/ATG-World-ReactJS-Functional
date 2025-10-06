import dbConnect from "@/config/db";
import User from "@/models/User";
import { hash } from 'bcryptjs';
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
        return new Response('Email, OTP and new password are required', { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return new Response('Invalid email format', { status:400 });
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
        return new Response('Invalid OTP format', { status:400 });
    }

    if (password.length < 6) {
        return new Response('Password must be at least 6 characters long', { status:400 });
    }
    
    try {
        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return new Response('Invalid or expired OTP', { status: 400 });
        }
        const hashedPassword = await hash(password, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();
        return new Response('Password reset successfully', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}