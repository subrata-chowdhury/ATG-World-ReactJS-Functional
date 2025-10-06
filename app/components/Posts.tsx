'use client'
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

const Posts = ({ onCommentClick }: { onCommentClick: (id: string) => void }) => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const limit = 10;
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const { logout } = useAuth();

    const fetchPosts = useCallback(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        fetch('/api/posts?token=' + token).then(async response => {
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
                if (!data.isLoggedIn) {
                    logout();
                }
            }
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching posts:', error);
            logout();
            setLoading(false);
        });
    }, [logout])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])


    return (
        <div className='flex flex-col gap-1.5'>
            {loading && <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-blue-500"></div>}
            {posts.map((post, i) => <Post {...post} key={i} onUpdate={fetchPosts} onCommentClick={() => onCommentClick(post._id)} />)}
            {
                totalPages > 1 && page < totalPages && (
                    <div className="flex justify-center my-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm cursor-pointer"
                            onClick={async () => {
                                const token = document.cookie
                                    .split('; ')
                                    .find(row => row.startsWith('token='))
                                    ?.split('=')[1];
                                const nextPage = page + 1;
                                try {
                                    const response = await fetch(`/api/posts?token=${token}?page=${nextPage}&limit=${limit}`);
                                    if (response.ok) {
                                        const data = await response.json();
                                        setPosts(prev => [...prev, ...data.comments]);
                                        setPage(nextPage);
                                        setTotalPages(data.totalPages || totalPages);
                                    }
                                } catch (error) {
                                    console.error('Error loading more comments:', error);
                                }
                            }}>
                            Load More
                        </button>
                    </div>
                )
            }
        </div>
    )
}

function Post({ _id, postImg, type, title, description, author, views, location, date, company, btns, likedBy, isLikedByUser, onUpdate, onCommentClick }: PostType) {
    const { userDetails } = useAuth();
    const navigate = useRouter();

    async function toggleLike() {
        if (userDetails === null) {
            alert('Please login to like the post');
            return;
        }
        try {
            const response = await fetch('/api/posts/' + _id + '/like', {
                method: 'POST',
            });
            if (response.ok) {
                onUpdate()
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }

    return (
        <div className='rounded-[4px] md:border border-[#E0E0E0] bg-[#FFF] [box-shadow:0px_1px_2px_0px_rgba(0,_0,_0,_0.12)] md:[box-shadow:none] max-w-[692px]'>
            {postImg && <Image src={postImg} alt='' width={692} height={220} />}
            <div className='p-5'>
                <div className='mb-2.5 text-[#000] text-[14px] sm:text-[18px] font-medium'>{type}</div>
                <div className='mb-3 text-[#000] text-[16px] sm:text-[22px] font-semibold leading-[134.545%]'>{title}</div>
                <div className='text-[#5C5C5C] text-[14px] sm:text-[19px] font-normal leading-[134.167%]'>{description}</div>
                <div className='flex gap-[40px] text-[#000] text-[12px] sm:text-[15px] font-medium mb-[16px]'>
                    {date && <div className='flex gap-1'><Image src={"/Icons/calendar.svg"} width={18} height={18} alt="" />{date}</div>}
                    {company && <div className='flex gap-1'><Image src={"/Icons/bag.svg"} width={18} height={18} alt="" />{company}</div>}
                    {location && <div className='flex gap-1'><Image src={"/Icons/location.svg"} width={18} height={18} alt="" />{location}</div>}
                </div>

                {btns && <div className='flex flex-col gap-1'>{btns.map((btn, i) => <button key={i} className={`h-[38px] text-center text-[13px] font-semibold leading-[140.4%] rounded-[8px] border-[0.7px] border-[#A9AEB8] bg-[#FFF]`} style={{ color: btn.color }} onClick={() => { if (btn.link) navigate.push(btn.link) }}>{btn.name}</button>)}</div>}

                <div className='mt-[32px] flex justify-between'>
                    <div className=' flex items-center justify-start gap-[10px]'>
                        <Image
                            src={author?.imgSrc ? ('/images/' + author.imgSrc) : '/icons/user.svg'}
                            alt=''
                            width={48}
                            height={48}
                            className={`rounded-full gap-2.5 w-[37px] h-[37px] md:w-[48px] md:h-[48px] ${author?.imgSrc ? '' : 'bg-black/20 p-1.5'}`}
                        />
                        <div className='flex flex-col gap-0'>
                            <div className='text-[#000] text-[13px] md:text-[18px] font-semibold'>{author.name}</div>
                            <div className='text-[#495057] text-[13px] md:text-[18px] font-semibold block md:hidden'>{formatNumber(views)}</div>
                        </div>
                    </div>
                    <div className='flex md:gap-[10px] lg:gap-[20px] xl:gap-[40px] items-center'>
                        <div className='text-[#525252] text-right text-[14px] gap-[8px] font-medium hidden md:flex'>
                            <Image src={"/Icons/eye.svg"} width={18} height={18} alt="" />
                            {formatNumber(views)} views
                        </div>
                        <div className='text-[#525252] text-right text-[14px] gap-[8px] font-medium hidden md:flex cursor-pointer' onClick={toggleLike}>
                            <Image src={isLikedByUser ? "/Icons/heart-filled.svg" : "/Icons/heart.svg"} width={18} height={18} alt="" />
                            {formatNumber(likedBy.length)}
                        </div>
                        <div className='md:w-[42px] h-[36px] py-[9px] px-[12px] bg-[#EDEEF0] rounded-[2px] flex gap-1 cursor-pointer border-r-2 md:border-r-0 border-r-gray-300' onClick={onCommentClick}>
                            <Image src={'/Icons/comment.svg'} width={18} height={18} alt='' />
                            <div className='text-[#212529] text-[12px] font-normal block md:hidden'>Comments</div>
                        </div>
                        <div className='md:w-[42px] h-[36px] py-[9px] px-[12px] bg-[#EDEEF0] rounded-[2px] flex gap-1'>
                            <Image src={'/Icons/share.svg'} width={18} height={18} alt='' />
                            <div className='text-[#212529] text-[12px] font-normal block md:hidden'>Share</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export type PostType = {
    _id: string;
    postImg?: string;
    type: string;
    title: string;
    description?: string;
    location?: string;
    date?: string;
    company?: string;
    author: {
        name: string;
        imgSrc: string;
    }
    views: number;
    likedBy: string[];
    btns?: {
        name: string;
        color: string;
        link?: string;
    }[];
    isLikedByUser: boolean;
    onUpdate: () => void;
    onCommentClick?: () => void;
}

export default Posts;

function formatNumber(num: number) {
    if (num < 1000) return num.toString();

    if (num < 100000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    }

    if (num < 10000000) {
        return (num / 100000).toFixed(num % 100000 === 0 ? 0 : 1) + "L";
    }

    return (num / 10000000).toFixed(num % 10000000 === 0 ? 0 : 1) + "Cr";
}