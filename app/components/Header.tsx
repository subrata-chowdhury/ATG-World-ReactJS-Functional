import Image from 'next/image';
import React from 'react'

const Header = () => {
    return (
        <div className='relative'>
            <div className=' absolute bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0.45)_0%,_rgba(0,_0,_0,_0.60)_100%)] w-full h-[440px]'>
            </div>
            <Image
                src={"/images/main-bg-croped.png"}
                width={1440}
                height={440}
                className='w-full object-cover object-center h-[440px]'
                alt=""
            />
            <div className='absolute text-white z-10 left-[16px] md:left-[10%] xl:left-[13.888%] bottom-[80px]'>
                <h1 className='sm:text-[36px] font-bold mb-[4px] text-[17px]'>Computer Engineering</h1>
                <p className='sm:text-[18px] text-[12px]'>142,765 Computer Engineers follow this</p>
            </div>
            <div className='flex md:hidden w-full justify-between items-center absolute top-[14px] px-[16px]'>
                <Image src={'/Icons/arrow_back_24px.svg'} width={24} height={24} alt=''/>
                <div className='text-[#FFF] text-[12px] font-medium w-[76px] h-[28px] mr-[2px] rounded-[4px] border-[0.8px] flex justify-center items-center border-[#FFF]'>Join Group</div>
            </div>
        </div>
    )
}

export default Header;