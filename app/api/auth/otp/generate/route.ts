import dbConnect from "@/config/db";
import User from "@/models/User";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { email } = await request.json();
    
    if (!email) {
        return new Response('Email is required', { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return new Response('Invalid email format', { status:400 });
    }

    try {
        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        user.otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();

        console.log(`OTP for ${email}: ${user.otp}  !!For Testing Purpose Only!!`); // For testing purposes only

        return new Response('OTP generated and sent to email', { status: 200 });
    } catch (error) {
        console.log('Error generating OTP:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}