import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const excludeTokenVerification = ['/api/auth/login', '/api/auth/signup', '/api/auth/otp/generate', '/api/auth/otp/verify', '/api/auth/password/reset'];
    if (excludeTokenVerification.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    if (/^\/api\/posts\/[^\/]+\/comments$/.test(request.nextUrl.pathname) && request.method==='GET') { // for /api/posts/:id/comments
        return NextResponse.next();
    }
    console.log(request.nextUrl.pathname, request.method);
    if(request.nextUrl.pathname === '/api/posts' && request.method === 'GET'){
        return NextResponse.next();
    }

    const token = (await cookies()).get('token')?.value;

    if (token) {
        try {
            const { payload } = await jwtVerify<{ id: string }>(token, new TextEncoder().encode(process.env.JWT_SECRET));
            if (!payload) {
                return new NextResponse('unauthorised access', { status: 401 });
            }
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user', payload.id);

            return NextResponse.next({
                request: { headers: requestHeaders }
            });
        } catch (error) {
            return new NextResponse('something went wrong', { status: 500 });
        }
    } else {
        return new NextResponse('unauthorised access', { status: 401 });
    }
}

export const config = {
    matcher: ['/api/:path*'], // Apply middleware only to specific routes
};
