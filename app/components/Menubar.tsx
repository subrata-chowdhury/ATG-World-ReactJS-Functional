import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'

const Menubar = ({ onCreateAccountBtnClick }: { onCreateAccountBtnClick: () => void }) => {
    const { userDetails, logout } = useAuth();
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    return (
        <>
            <div className='hidden md:flex md:px-[50px] xl:px-[72px] h-[72px] items-center justify-between bg-[#FFFFFF] [box-shadow:0px_1px_2px_0px_rgba(0,_0,_0,_0.12)] z-20'>
                <Link href={'/'}>
                    <Image
                        src="/Icons/logo.svg"
                        alt="Logo"
                        width={162.57}
                        height={24}
                    />
                </Link>
                <div className='flex w-[360px] h-[42px] rounded-[21px] bg-[#F2F2F2] mx-5'>
                    <Image
                        width={22}
                        height={22}
                        src="/Icons/search.svg"
                        className='mx-3.5 my-2.5'
                        alt="Logo" />
                    <input
                        type="text"
                        placeholder='Search for your favorite groups in ATG'
                        className='flex-grow outline-0 text-[#5C5C5C] text-[14px] pr-3.5 font-medium'
                    />
                </div>
                {userDetails ? <div className='flex items-center gap-3 cursor-pointer' onClick={() => setShowProfilePopup(!showProfilePopup)}>
                    <Image
                        width={38}
                        height={38}
                        src={userDetails?.imgSrc || "/icons/user.svg"}
                        className='rounded-full bg-black/30 p-1'
                        alt="User Avatar" />
                    <span className='text-[#2E2E2E] text-[16px] font-medium'>{userDetails.name}</span>
                </div>
                    : <div className='text-[#2E2E2E] text-right text-[16px] font-medium cursor-pointer' onClick={onCreateAccountBtnClick}>
                        Create account. <span className='text-[#2F6CE5] text-[16px] font-bold'>It&#39;s free!</span>
                    </div>}
                {showProfilePopup && userDetails &&
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur' onClick={() => setShowProfilePopup(false)}>
                        <div className='bg-white p-6 rounded-lg w-[90vw] max-w-md max-h-[80vh] overflow-y-auto flex flex-col justify-center items-center' onClick={e => e.stopPropagation()}>
                            <Image
                                width={120}
                                height={120}
                                src={userDetails?.imgSrc || "/icons/user.svg"}
                                className='rounded-full bg-black/30 p-5'
                                alt="User Avatar" />
                            <span className='text-[#2E2E2E] text-xl font-medium'>{userDetails.name}</span>
                            <div className="mt-6 w-full flex flex-col gap-4">
                                <Link
                                    href="/posts/owned"
                                    className="w-full text-center py-2 rounded bg-[#F2F2F2] text-[#2E2E2E] font-medium hover:bg-[#E0E0E0] transition"
                                    onClick={() => setShowProfilePopup(false)}
                                >
                                    My Posts
                                </Link>
                                <button
                                    className="w-full py-2 rounded bg-[#2F6CE5] text-white font-bold hover:bg-[#1e4ca0] transition cursor-pointer"
                                    onClick={() => {
                                        setShowProfilePopup(false);
                                        logout();
                                        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>}
            </div>
            <div className='md:hidden h-[24px] px-[12px] flex justify-end items-center'>
                <Image src="/Icons/threeShapes.svg" width={51} height={10} alt='' />
            </div>
        </>
    )
}

export default Menubar