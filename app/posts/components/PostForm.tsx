'use client'
import Dropdown from '@/components/Dropdown';
import React, { useState } from 'react'

type Props = {
    postDetails: PostType,
    setPostDetails: (value: PostType) => void,
    onSubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void
    onDelete?: () => void
}

const PostForm = ({ postDetails, setPostDetails, onSubmit, onDelete }: Props) => {
    const [showAddBtnPopup, setShowAddBtnPopup] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [btnDetails, setBtnDetails] = useState<{ name: string; link: string; color: string }>({ name: '', link: '', color: '#000000' });

    return (
        <>
            <div className='lg:px-12 lg:py-10 bg-black/5'>
                <div className='px-10 py-8 rounded bg-white'>
                    <div className='text-xl font-semibold text-[#000000]'>Create a Post</div>
                    <div className='font-normal text-[#5C5C5C] mt-1'>Write your post and share your thoughts with the world!</div>
                    <div className='mt-4 flex flex-col gap-2'>
                        <label className='font-medium text-[#333]'>
                            Title
                            <input type="text" placeholder='Title' className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none mt-1' value={postDetails.title || ""} onChange={e => setPostDetails({ ...postDetails, title: e.target.value })} />
                        </label>
                        <label className='font-medium text-[#333]'>
                            Description
                            <textarea placeholder='Description' className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none h-[200px] resize-y mt-1' value={postDetails.description || ""} onChange={e => setPostDetails({ ...postDetails, description: e.target.value })} />
                        </label>
                        <label className='font-medium text-[#333]'>
                            Image URL
                            <input type="text" placeholder='Image URL' className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none mt-1' value={postDetails.postImg || ""} onChange={e => setPostDetails({ ...postDetails, postImg: e.target.value })} />
                        </label>
                        <div className='flex gap-4 w-full'>
                            <label className='font-medium flex-1 text-[#333]'>
                                Company
                                <input type="text" placeholder='Company' className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none mt-1' value={postDetails.company || ""} onChange={e => setPostDetails({ ...postDetails, company: e.target.value })} />
                            </label>
                            <label className='font-medium flex-1 text-[#333]'>
                                Type
                                <Dropdown value={'✍️ Article'} options={["✍️ Article", "🔬️ Education", "🗓️ Meetup", "💼️ Job"]} onChange={value => { setPostDetails({ ...postDetails, type: value.value as string }) }} height={41} width={'100%'} containerClassName='mt-1' />
                            </label>
                        </div>
                        <div className='flex gap-4 w-full'>
                            <label className='font-medium flex-1 text-[#333]'>
                                Location
                                <input type="text" placeholder='Location' className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none mt-1' value={postDetails.location || ""} onChange={e => setPostDetails({ ...postDetails, location: e.target.value })} />
                            </label>
                            <label className='font-medium flex-1 text-[#333]'>
                                Date
                                <input type="date" placeholder='Date' className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none mt-1' value={postDetails.date || ""} onChange={e => setPostDetails({ ...postDetails, date: e.target.value })} />
                            </label>
                        </div>
                        <div>
                            <div className='font-medium flex flex-1 mt-4 text-[#333]'>
                                Buttons
                                <div className='bg-[#2F6CE5] rounded text-white px-3 py-1.5 ml-auto cursor-pointer' onClick={() => { setBtnDetails({ name: '', link: '', color: '#000000' }); setShowAddBtnPopup(true) }}>Add +</div>
                            </div>
                            {
                                postDetails.btns && postDetails.btns.length > 0 ? (
                                    <table className="mt-2 w-full border border-gray-300 rounded">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-3 py-2 text-left">Name</th>
                                                <th className="px-3 py-2 text-left">Link</th>
                                                <th className="px-3 py-2 text-left">Color</th>
                                                <th className="px-3 py-2 text-left">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {postDetails.btns.map((btn, index) => (
                                                <tr key={index} className="border-t border-t-gray-300">
                                                    <td className="px-3 py-2">{btn.name}</td>
                                                    <td className="px-3 py-2">{btn.link || '-'}</td>
                                                    <td className="px-3 py-2">
                                                        <span className="inline-block w-6 h-6 rounded" style={{ backgroundColor: btn.color, border: '1px solid #ccc' }}></span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span className="cursor-pointer text-red-600 font-semibold" onClick={() => {
                                                            const updatedBtns = postDetails.btns ? postDetails.btns.filter((_, i) => i !== index) : [];
                                                            setPostDetails({ ...postDetails, btns: updatedBtns });
                                                        }}>
                                                            Delete
                                                        </span>
                                                        <span
                                                            className="cursor-pointer ml-4 text-blue-600 font-semibold"
                                                            onClick={() => {
                                                                setShowAddBtnPopup(true);
                                                                setBtnDetails({
                                                                    name: btn.name,
                                                                    link: btn.link || '',
                                                                    color: btn.color
                                                                });
                                                                setEditIndex(index)
                                                            }}
                                                        >
                                                            Edit
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className='text-gray-500 mt-2'>No buttons added yet. Click on &quot;Add +&quot; to add buttons.</div>
                                )
                            }
                        </div>
                        <div className='flex gap-2 ml-auto'>
                            {postDetails?._id && <button className='bg-[#e5592f] text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-700 mt-4' onClick={onDelete}>Delete</button>}
                            <button className='bg-[#2F6CE5] text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-700 mt-4' onClick={onSubmit}>{postDetails?._id ? 'Save' : 'Post'}</button>
                        </div>
                    </div>
                </div>
            </div>
            {showAddBtnPopup && <div className='fixed top-0 left-0 w-full h-full bg-black/20 z-20' style={{ display: showAddBtnPopup ? 'block' : 'none' }} onClick={() => setShowAddBtnPopup(false)}>
                <div className='flex gap-2 mt-1 flex-col p-4 bg-white rounded shadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' onClick={e => e.stopPropagation()}>
                    <label className='font-medium text-[#333]'>
                        Name
                        <input
                            type="text"
                            placeholder='Name'
                            className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none mt-1'
                            value={btnDetails.name}
                            onChange={e => setBtnDetails({ ...btnDetails, name: e.target.value })}
                        />
                    </label>
                    <label className='font-medium text-[#333]'>
                        Link
                        <input
                            type="text"
                            placeholder='Link'
                            className='w-full border border-gray-300 rounded px-3 py-2 font-normal outline-none mt-1'
                            value={btnDetails.link}
                            onChange={e => setBtnDetails({ ...btnDetails, link: e.target.value })}
                        />
                    </label>
                    <label className='font-medium text-[#333]'>
                        Button Color<br />
                        <input
                            type="color"
                            title='Button Color'
                            className='w-16 h-10 p-0 border border-gray-300 rounded cursor-pointer mt-1'
                            value={btnDetails.color}
                            onChange={e => setBtnDetails({ ...btnDetails, color: e.target.value })}
                        />
                    </label>
                    <button
                        className='bg-[#2F6CE5] text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-700 ml-auto cursor-pointer'
                        onClick={() => {
                            if (btnDetails.name.trim() === '') {
                                alert('Button name cannot be empty');
                                return;
                            }
                            if (editIndex !== null && postDetails.btns) {
                                const updatedBtns = [...postDetails.btns];
                                updatedBtns[editIndex] = btnDetails;
                                setPostDetails({ ...postDetails, btns: updatedBtns });
                                setEditIndex(null);
                                setBtnDetails({ name: '', link: '', color: '#000000' });
                                setShowAddBtnPopup(false);
                            } else {
                                const updatedBtns = postDetails.btns ? [...postDetails.btns, btnDetails] : [btnDetails];
                                setPostDetails({ ...postDetails, btns: updatedBtns });
                                setBtnDetails({ name: '', link: '', color: '#000000' });
                                setShowAddBtnPopup(false)
                            }
                        }}>{editIndex !== null ? 'Save' : 'Add'}</button>
                </div>
            </div>}
        </>
    )
}

export default PostForm;

export type PostType = {
    _id?: string;
    postImg?: string;
    type: string;
    title: string;
    description?: string;
    location?: string;
    date?: string;
    company?: string;
    btns?: {
        name: string;
        color: string;
        link?: string;
    }[];
}