import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Tabs = () => {
    return (
        <div className='flex justify-between md:border-b border-[#E0E0E0] mt-[22px] ms-[16px] mr-[18px] mb-[26px] md:mt-[32px] md:mb-[28px] md:mx-[10%] xl:mx-[13.888%]'>
            <div className='flex items-center md:items-start gap-[20px]'>
                <Tab name='All Posts(32)' hideable={false} active={true} />
                <Tab name='Article' />
                <Tab name='Event' />
                <Tab name='Education' />
                <Tab name='Job' />
            </div>
            <div className='flex gap-4 items-center ms-[20px]'>
                <div className='rounded-[4px] bg-[#EDEEF0] w-[106px] h-[32px] justify-center items-center gap-2.5 text-[#212529] text-[13px] font-medium md:hidden flex'>Filter: All<Image src="/Icons/downArrow.svg" alt="" width={22} height={22} /></div>

                <Link href={'/posts/create'} className='rounded-[4px] bg-[#EDEEF0] w-[133px] h-[36px] justify-center items-center gap-2.5 text-[#000] text-[15px] font-medium hidden md:flex cursor-pointer'>Write a Post<Image src="/Icons/downArrow.svg" alt="" width={22} height={22} /></Link>
                <div className='w-[125px] h-[36px] rounded-[4px] bg-[#2F6CE5] justify-center items-center gap-1.5 text-[#FFF] text-[15px] font-medium hidden md:flex'><Image src="/Icons/joinGroup.svg" alt="" width={22} height={22} />Join Group</div>
            </div>
        </div>
    )
}

function Tab({ name, active = false, hideable = true }: { name: string, active?: boolean, hideable?: boolean }) {
    return (
        <div className={`text-[14px] md:text-[16px] py-0 md:pt-[15px] md:pb-[20px] text-nowrap ${active ? 'md:border-b border-black text-[#000000]' : 'text-[#8A8A8A]'} ${hideable ? "hidden md:block" : ''}`}>{name}</div>
    )
}

export default Tabs