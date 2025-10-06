'use client'
import Menubar from '@/app/components/Menubar';
import SignUpAndSignInForm from '@/app/components/SignUpAndSignInForm';
import React, { useEffect, useState } from 'react'
import PostForm, { PostType } from '../components/PostForm';
import { usePathname, useRouter } from 'next/navigation';

const EditPostPage = () => {
    const pathname = usePathname();
    const id = pathname.split('/')[2];
    const [showSignUpSignInForm, setShowSignUpSignInForm] = useState<boolean>(false);
    const [postDetails, setPostDetails] = useState<PostType>({
        type: "✍️ Article",
        title: ""
    });
    const navigate = useRouter();

    async function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        fetch('/api/posts/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postDetails),
        }).then(async res => {
            if (res.ok) {
                alert('Post updated successfully');
            } else {
                alert(await res.text() || 'Error updating post')
            }
        }).catch(err => {
            console.error('Error updating post:', err);
            alert('Error updating post');
        })
    }

    async function onDelete() {
        if (!confirm('Are you sure you want to delete this post?')) return;
        fetch('/api/posts/' + id, {
            method: 'DELETE',
        }).then(async res => {
            if (res.ok) {
                alert('Post deleted successfully');
                navigate.push('/posts/owned');
            } else {
                alert(await res.text() || 'Error deleting post')
            }
        }).catch(err => {
            console.error('Error deleting post:', err);
            alert('Error deleting post');
        })
    }

    useEffect(() => {
        if (!id) return;
        fetch('/api/posts/' + id, {
            method: 'GET',
        }).then(res => res.json()).then(data => {
            if (data) {
                setPostDetails(data);
            }
        }).catch(err => {
            console.error('Error fetching post details:', err);
            alert('Error fetching post details');
        });
    }, [id])

    return (
        <>
            <Menubar onCreateAccountBtnClick={() => setShowSignUpSignInForm(true)} />
            {showSignUpSignInForm && <SignUpAndSignInForm onClose={() => setShowSignUpSignInForm(false)} />}
            <PostForm postDetails={postDetails} setPostDetails={setPostDetails} onSubmit={onSubmit} onDelete={onDelete} />
        </>
    )
}

export default EditPostPage;
