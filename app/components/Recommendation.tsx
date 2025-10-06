import Image from 'next/image'
import React from 'react'

const Recommendation = () => {
    return (
        <div className='w-[243px] hidden md:block mt-[28px]'>
            <div className='border-b border-[#B8B8B8] flex pb-[11px]'>
                <Image width={18} height={18} src={"/Icons/location.svg"} className='mr-1' alt='' />
                <input type='text' className='text-[#808080] text-[14px] flex-grow outline-0' placeholder='Enter your location' />
                <Image width={18} height={18} src="/Icons/filledPen.svg" alt="" />
            </div>
            <div className='flex items-start gap-[7px] mt-[32px] mb-[54px] text-[#000] text-[12px] opacity-50'>
                <Image width={16} height={16} src="/Icons/warning.svg" alt="" />
                <div>Your location will help us serve better and extend a personalised experience.</div>
            </div>
            <div className='flex gap-1 text-[#000] text-[14px] tracking-[1.4px] uppercase text-nowrap'>
                <Image src={'/Icons/like.svg'} width={18} height={18} alt='' />
                RECOMMENDED GROUPS
            </div>
            <div className='flex flex-col gap-[22px] mt-[24px]'>
                <Profile imgSrc={'/images/grp1.png'} name={'Leisure'} isFollowing={true} />
                <Profile imgSrc={'/images/grp2.png'} name={'Activism'} />
                <Profile imgSrc={'/images/grp3.png'} name={'MBA'} />
                <Profile imgSrc={'/images/grp4.png'} name={'Philosophy'} />
            </div>
            <div className='text-[#2F6CE5] text-right text-[12px] mt-[54px]'>
                See More...
            </div>
        </div>
    )
}

function Profile({ imgSrc, name, isFollowing = false }: { imgSrc: string, name: string, isFollowing?: boolean }) {
    return (
        <div className='flex justify-between items-center'>
            <div className='flex gap-3 items-center text-sm'>
                <Image width={36} height={36} src={imgSrc} alt='' />
                {name}
            </div>
            <div className={`px-3 py-1 rounded-2xl text-[12px] ${isFollowing ? "bg-[#000000] text-white" : "bg-[#EDEEF0]"}`}>{isFollowing ? 'Followed' : 'Follow'}</div>
        </div>
    )
}

export default Recommendation