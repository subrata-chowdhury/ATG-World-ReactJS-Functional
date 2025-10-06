import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = async ({ children }: Props) => {
    const token = (await cookies()).get('token')?.value;
    if (token === undefined) {
        redirect('/'); // Redirect to login if the token is invalid
    }

    const { payload } = await jwtVerify<{ id: string }>(token || '', new TextEncoder().encode(process.env.JWT_SECRET));

    if (!payload) {
        redirect('/'); // Redirect to login if the token is invalid
    }

    return (
        <>{children}</>
    )
}

export default layout