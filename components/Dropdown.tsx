import React, { useState } from 'react'
import dropdownArrow from '@/assets/dropdown-arrow.svg'
import Image from 'next/image'
type Props = {
    options: string[] | number[],
    value: string | number,
    onChange?: (opt: { value: string | number, index: number }) => void,
    width?: string | number,
    height?: number,
    showPopupAtTop?: boolean,
    containerClassName?: string,
    optionElement?: (props: { option: string | number, index: number, onClick: () => void }) => React.JSX.Element,
    ref?: React.RefObject<HTMLDivElement | null>;
    loading?: boolean
}

function Dropdown({ options = [], value = "", onChange = () => { }, containerClassName = '', width, height, showPopupAtTop = false, optionElement, ref, loading = false }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={'relative ' + containerClassName} style={{ width: width || 'fit-content' }}>
            <div className='flex justify-between items-center border-gray-200 dark:border-gray-400 border-opacity-40 border-2 p-2 rounded cursor-pointer gap-1' onClick={() => !loading ? setIsOpen(!isOpen) : ''} ref={ref} style={{ height: height || 40, width: width || 'fit-content' }}>
                <div className='text-nowrap truncate' title={value.toString()}>{value}</div>
                <Image src={dropdownArrow} alt='Search Icon' width={16} height={16} className={`transition-all w-4 h-4 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
            {isOpen && <div className='border-2 border-gray-300 absolute w-full bg-white dark:bg-[#172A46] dark:border-gray-400 z-10 my-1 rounded max-h-60 overflow-y-auto' style={{ top: showPopupAtTop ? 'auto' : '100%', bottom: showPopupAtTop ? '100%' : 'auto' }}>
                {!optionElement && options.map((option, index) => (
                    <div
                        key={index}
                        className='p-2 hover:bg-gray-200 hover:dark:bg-slate-600 cursor-pointer'
                        onClick={() => {
                            onChange({ value: option, index });
                            setIsOpen(false)
                        }}>
                        {option}
                    </div>))}
                {optionElement && options.map((option, index) => optionElement({ option, index, onClick: () => setIsOpen(false) }))}
            </div>}
        </div>
    )
}

export default Dropdown