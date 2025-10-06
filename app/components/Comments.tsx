'use client'
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
    postId: string;
    onClose: () => void;
}

const Comments = ({ postId, onClose }: Props) => {
    const [comments, setComments] = useState<{ post: string, author: { name: string, imgSrc: string }, content: string }[]>([]);
    const [commentInput, setCommentInput] = useState<string>('');
    const limit = 10;
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const { userDetails } = useAuth();

    const handleSendComment = async () => {
        if (userDetails === null) {
            alert('Please login to comment');
            return;
        }

        if (!commentInput.trim()) return;
        try {
            const response = await fetch('/api/posts/' + postId + '/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: commentInput }),
            });
            if (response.ok) {
                setCommentInput('');
                fetchComments();
            } else {
                console.error('Failed to send comment');
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        }
    };

    const fetchComments = useCallback(() => {
        fetch('/api/posts/' + postId + '/comments').then(async response => {
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments);
                setTotalPages(data.pagination.totalPages || 1);
                setPage(data.pagination.currentPage || 1);
            }
        }).catch(error => {
            console.log('Error fetching comments:', error);
        });
    }, [postId])

    useEffect(() => {
        fetchComments();
    }, [fetchComments])


    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur' onClick={onClose}>
            <div className='bg-white p-6 rounded-lg w-[90vw] max-w-md max-h-[80vh] overflow-y-auto' onClick={e => e.stopPropagation()}>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Comments</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700 cursor-pointer w-6 h-6'>
                        <Image src={"/Icons/crossWithoutBorder.svg"} width={28} height={28} alt='' />
                    </button>
                </div>
                <div>
                    {/* Comments will be rendered here */}
                    {comments.length > 0 ? comments.map((comment, index) => (
                        <div key={index} className='mb-2 pb-2 flex flex-col'>
                            <p className='text-sm text-gray-600'>By: {comment.author.name}</p>
                            <p className='text-gray-800'>{comment.content}</p>
                        </div>
                    )) : <p className='text-gray-600'>No comments yet. Be the first to comment!</p>}
                    {
                        totalPages > 1 && page < totalPages && (
                            <div className="flex justify-center my-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm cursor-pointer"
                                    onClick={async () => {
                                        const nextPage = page + 1;
                                        try {
                                            const response = await fetch(`/api/posts/${postId}/comments?page=${nextPage}&limit=${limit}`);
                                            if (response.ok) {
                                                const data = await response.json();
                                                setComments(prev => [...prev, ...data.comments]);
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
                    <div className="flex items-center mt-4">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 border-2 text-sm border-gray-500 rounded-l px-3 py-2 outline-none"
                            value={commentInput}
                            onChange={e => setCommentInput(e.target.value)}
                        />
                        <button
                            className="bg-[#2F6CE5] text-white px-4 py-2 rounded-r hover:bg-blue-700"
                            onClick={handleSendComment}
                            disabled={!commentInput.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comments