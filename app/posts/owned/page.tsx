'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { PostType } from '@/app/components/Posts';
import Menubar from '@/app/components/Menubar';
import SignUpAndSignInForm from '@/app/components/SignUpAndSignInForm';
import Image from 'next/image';

const OwnedPosts = () => {
    const [showSignUpSignInForm, setShowSignUpSignInForm] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const limit = 10;
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        fetch('/api/posts/owned', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            if (data.posts) {
                setPosts(data.posts);
                setLoading(false);
            }
        }).catch(err => {
            console.error('Error fetching posts:', err);
            alert('Error fetching posts');
            setLoading(false);
        });
    }, []);

    return (
        <>
            <Menubar onCreateAccountBtnClick={() => setShowSignUpSignInForm(true)} />
            {showSignUpSignInForm && <SignUpAndSignInForm onClose={() => setShowSignUpSignInForm(false)} />}
                <Link href={'/posts/create'} className='rounded-[4px] bg-[#EDEEF0] w-[133px] h-[36px] justify-center items-center gap-2.5 text-[#000] text-[15px] font-medium hidden md:flex cursor-pointer ml-auto mt-4 mr-4'>Write a Post<Image src="/Icons/downArrow.svg" alt="" width={22} height={22} /></Link>
            <div className='flex flex-col gap-4 p-4'>
                {
                    posts.map(post => (
                        <Link key={post._id} href={`/posts/${post._id}`} className='flex gap-4 border border-gray-300 p-4 rounded-md transition-all hover:shadow-md'>
                            <div className='flex flex-col'>
                                <h2>{post.title}</h2>
                                <p>{post.type}</p>
                            </div>
                            <div className='ml-auto my-auto font-semibold'>{post.views}</div>
                            <div className='my-auto font-semibold'>{post.likedBy.length}</div>
                        </Link>
                    ))
                }
                {
                    loading && <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-blue-500"></div>
                }
                {
                    !loading && posts.length === 0 && <div>No posts found.</div>
                }
                {
                        totalPages > 1 && page < totalPages && (
                            <div className="flex justify-center my-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm cursor-pointer"
                                    onClick={async () => {
                                        const nextPage = page + 1;
                                        try {
                                            const response = await fetch(`/api/posts/owned?page=${nextPage}&limit=${limit}`);
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
        </>
    )
}

export default OwnedPosts