'use client'
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'

const SignUpAndSignInForm = ({ onClose = () => { } }: { onClose?: () => void }) => {
    const [isInSignUpState, setIsInSignUpState] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { login } = useAuth();

    async function onSubmit() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if (isInSignUpState) {
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: firstName + ' ' + lastName,
                    email,
                    password,
                }),
            }).then(async response => {
                if (response.ok) {
                    const res = await response.json();
                    document.cookie = `token=${res.token}; path=/; secure; samesite=strict`;
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', res.user.name);
                    localStorage.setItem('userEmail', res.user.email);
                    if(res?.user?.imgSrc)
                        localStorage.setItem('userImg', res?.user?.imgSrc);
                    login(res.user);
                    onClose();
                } else {
                    alert((await response.text()) || 'Signup failed');
                    console.error('Signup failed');
                }
            }).catch(error => {
                console.error('Error during signup:', error);
            });
        } else {
            fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }).then(async response => {
                if (response.ok) {
                    const res = await response.json();
                    document.cookie = `token=${res.token}; path=/; secure; samesite=strict`;
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', res.user.name);
                    localStorage.setItem('userEmail', res.user.email);
                    if(res?.user?.imgSrc)
                        localStorage.setItem('userImg', res?.user?.imgSrc);
                    login(res.user);
                    onClose();
                } else {
                    alert((await response.text()) || 'Login failed');
                    console.error('Signup failed');
                }
            }).catch(error => {
                console.error('Error during signup:', error);
            });
        }
    }

    return (
        <div className='fixed top-0 left-0 w-full h-screen z-20 bg-black/50'>
            <div className={`fixed md:relative bottom-0 left-0 md:top-1/2 md:left-1/2 md:-translate-1/2 w-full md:w-[736px] bg-white rounded-t-[8px] md:rounded-[8px] min-h-[462px]`} onClick={e => e.stopPropagation()}>
                <div className='absolute hidden md:block top-[-50px] right-[-19px] cursor-pointer' onClick={onClose}><Image src={"/Icons/cross.svg"} width={28} height={28} alt='' /></div>
                <div className='h-[50px] w-full rounded-t-[8px] bg-[#EFFFF4] justify-center items-center text-[#008A45] text-center text-[14px] font-medium leading-[16px] hidden md:flex'>Let&#39;s learn, share & inspire each other with our passion for computer engineering. Sign up now 🤘🏼</div>
                <div className='px-[20px] pt-[22px] pb-[18px] md:p-9 md:pt-6'>
                    <div className='flex gap-[24px] w-full'>
                        <div className='w-full md:w-auto'>
                            <div className='text-[#000] text-[18px] md:text-[24px] font-bold mb-[24px] flex justify-between'>{isInSignUpState ? 'Create Account' : (<><span className=' hidden md:block'>Sign In</span><span className='block md:hidden'>Welcome back!</span></>)}<Image src={'/Icons/filledCross.svg'} className='block md:hidden cursor-pointer' onClick={onClose} width={24} height={24} alt='' /></div>
                            <div className='w-full md:w-[320px]'>
                                {isInSignUpState && <div className='flex w-full'>
                                    <input type='text' className='h-[46px] rounded-tl-[2px] w-1/2 border-[1px] border-[#D9D9DB] bg-[#F7F8FA] py-[15px] px-[12px] placeholder:text-[#8A8A8A] text-[13px] md:text-[15px] font-medium leading-[16px] outline-0' placeholder='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
                                    <input type='text' className='h-[46px] rounded-tr-[2px] w-1/2 border-[1px] border-l-0 border-[#D9D9DB] bg-[#F7F8FA] py-[15px] px-[12px] placeholder:text-[#8A8A8A] text-[13px] md:text-[15px] font-medium leading-[16px] outline-0' placeholder='Last Name' value={lastName} onChange={e => setLastName(e.target.value)} />
                                </div>}
                                <input type='text' className={`h-[46px] border-[1px] border-[#D9D9DB] w-full bg-[#F7F8FA] py-[15px] px-[12px] placeholder:text-[#8A8A8A] text-[13px] md:text-[15px] font-medium leading-[16px] outline-0 ${isInSignUpState ? "border-t-0" : ''}`} placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                                <div className='h-[46px] border-[1px] border-t-0 border-[#D9D9DB] w-full bg-[#F7F8FA] flex justify-between pr-[18px]'>
                                    <input type='text' className='text-[13px] md:text-[15px] font-medium leading-[16px] placeholder:text-[#8A8A8A] py-[15px] px-[12px] outline-0' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                                    <Image src={'/Icons/eye.svg'} width={18} height={18} alt='' />
                                </div>
                                {isInSignUpState && <input type='text' className='h-[46px] rounded-b-[2px] border-t-0 border-[1px] border-[#D9D9DB] w-full bg-[#F7F8FA] py-[15px] px-[12px] placeholder:text-[#8A8A8A] text-[13px] md:text-[15px] font-medium leading-[16px] outline-0' placeholder='Confirm Password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
                            </div>
                            <div className='flex justify-between items-center'>
                                <button className='text-[#FFF] text-center text-[13px] md:text-[14px] font-semibold leading-[16px] mt-[19px] mb-[24px] w-[150px] md:w-full flex justify-center items-center h-[40px] rounded-[20px] bg-[#2F6CE5] cursor-pointer' onClick={onSubmit}>{isInSignUpState ? 'Create Account' : 'Sign In'}</button>
                                <div className='text-[#495057] text-center text-[13px] font-medium underline block md:hidden cursor-pointer' onClick={() => setIsInSignUpState(val => !val)}>{isInSignUpState ? 'or, Sign In' : 'or, Create Account'}</div>
                            </div>
                            <button className='flex gap-[10px] justify-center items-center rounded-[2px] border-[0.6px] border-[#D9D9DB] bg-[#FFF] w-full md:w-[320px] h-[38px] text-[#000] text-[13px] md:text-[14px] font-normal leading-[16px] cursor-pointer'><Image src={'/images/facebook.png'} width={16} height={16} alt='' />Sign up with Facebook</button>
                            <button className='flex gap-[10px] justify-center items-center rounded-[2px] border-[0.6px] border-[#D9D9DB] bg-[#FFF] w-full md:w-[320px] h-[38px] mt-[8px] text-[#000] text-[13px] md:text-[14px] font-normal leading-[16px] cursor-pointer'><Image src={'/Icons/google.svg'} width={16} height={16} alt='' />Sign up with Google</button>
                            {!isInSignUpState && <div className='text-[#000] text-center text-[12px] font-medium leading-[16px] mt-[23px] cursor-pointer'><Link href={'/forget-password'}>Forgot Password?</Link></div>}
                            {isInSignUpState && <div className='block md:hidden mt-[22px] text-[#212529] text-center text-[11px] font-normal leading-[16px]'>By signing up, you agree to our Terms & conditions, Privacy policy</div>}
                        </div>
                        <div className='flex-col hidden md:flex'>
                            <div className='text-[#3D3D3D] text-right text-[13px] font-normal mt-[7px]'>
                                {isInSignUpState ? 'Already have an account?' : 'Don’t have an account yet?'} <span className='font-semibold text-[#2F6CE5] cursor-pointer' onClick={() => setIsInSignUpState(val => !val)}>{isInSignUpState ? 'Sign In' : 'Create new for free!'}</span>
                            </div>
                            <Image src={'/Icons/signUp.svg'} className='mt-[31px]' width={320} height={320} alt='' />
                            {isInSignUpState && <div className='text-black/60 text-right text-[11px] font-normal leading-[16px] text-nowrap mt-auto'>By signing up, you agree to our Terms & conditions, Privacy policy</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpAndSignInForm