'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [formState, setFormState] = useState<'email' | 'otp' | 'password'>('email')
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useRouter();

    return (
        <div className='flex h-screen'>
            <div className='flex-1 h-screen bg-black/30 hidden md:flex justify-center items-center text-xl font-semibold'>Reset Your Passowrd</div>
            <div className='flex-1 my-auto mx-auto'>
                <div className='md:w-[320px] lg:w-[480px] px-5 mx-auto flex flex-col'>
                    <h1 className='font-medium mb-4'>Enter {formState === 'email' ? "Email" : (formState === 'otp' ? "OTP" : "new Password")}</h1>
                    {formState === 'email' && <input type='text' className={`h-[46px] border-[1px] border-[#D9D9DB] w-full bg-[#F7F8FA] py-[15px] px-[12px] placeholder:text-[#8A8A8A] text-[13px] md:text-[15px] font-medium leading-[16px] outline-0`} placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />}
                    {formState === 'otp' && <input type='text' className={`h-[46px] border-[1px] border-[#D9D9DB] w-full bg-[#F7F8FA] py-[15px] px-[12px] placeholder:text-[#8A8A8A] text-[13px] md:text-[15px] font-medium leading-[16px] outline-0`} placeholder='OTP' value={otp} onChange={e => setOtp(e.target.value)} />}
                    {formState === 'password' && <div className='h-[46px] border-[1px] border-t-0 border-[#D9D9DB] w-full bg-[#F7F8FA] flex justify-between pr-[18px]'>
                        <input type={showPassword ? 'text' : 'password'} className='text-[13px] md:text-[15px] font-medium leading-[16px] placeholder:text-[#8A8A8A] py-[15px] px-[12px] outline-0' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                        <Image src={'/Icons/eye.svg'} width={18} height={18} alt='' className='cursor-pointer' onClick={() => setShowPassword(val => !val)} />
                    </div>}
                    <button
                        className="bg-[#2F6CE5] cursor-pointer text-white px-4 py-2 mt-4 text-sm font-semibold tracking-wider rounded hover:bg-blue-700 ml-auto"
                        onClick={() => {
                            if (formState === 'email') {
                                if (!email) {
                                    alert('Email is required');
                                    return;
                                }
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(email)) {
                                    alert('Invalid email format');
                                    return;
                                }
                                fetch('/api/auth/otp/generate', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ email }),
                                }).then(res => {
                                    if (res.ok) {
                                        alert('OTP sent to your email');
                                        setFormState('otp');
                                    } else {
                                        alert('Error sending OTP');
                                    }
                                });
                            } else if (formState === 'otp') {
                                if (!otp) {
                                    alert('OTP is required');
                                    return;
                                }
                                const otpRegex = /^\d{6}$/;
                                if (!otpRegex.test(otp)) {
                                    alert('Invalid OTP format');
                                    return;
                                }
                                fetch('/api/auth/otp/verify', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ email, otp }),
                                }).then(res => {
                                    if (res.ok) {
                                        alert('OTP verified');
                                        setFormState('password');
                                    } else {
                                        alert('Invalid OTP');
                                    }
                                });
                            } else {
                                if (!password) {
                                    alert('Password is required');
                                    return;
                                }
                                if(password.length < 6) {
                                    alert('Password must be at least 6 characters long');
                                    return;
                                }
                                fetch('/api/auth/password/reset', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ email, otp, password }),
                                }).then(res => {
                                    if (res.ok) {
                                        alert('Password reset successful');
                                        navigate.push('/');
                                    } else {
                                        alert('Error resetting password');
                                    }
                                });
                            }
                        }}
                    >{formState === 'email' ? "Send OTP" : (formState === 'otp' ? "Verify" : "Reset")}</button>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword