'use client'
import Menubar from '@/app/components/Menubar';
import SignUpAndSignInForm from '@/app/components/SignUpAndSignInForm';
import React, { useState } from 'react'
import PostForm, { PostType } from '../components/PostForm';

const CreatePostPage = () => {
    const [showSignUpSignInForm, setShowSignUpSignInForm] = useState<boolean>(false);
    const [postDetails, setPostDetails] = useState<PostType>({
        type: "✍️ Article",
        title: ""
    });

    async function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postDetails),
        }).then(async res => {
            if (res.ok) {
                alert('Post created successfully');
                setPostDetails({
                    type: "✍️ Article",
                    title: "",
                    btns: []
                });
            } else {
                alert(await res.text() || 'Error creating post')
            }
        }).catch(err => {
            console.error('Error creating post:', err);
            alert('Error creating post');
        })
    }

    return (
        <>
            <Menubar onCreateAccountBtnClick={() => setShowSignUpSignInForm(true)} />
            {showSignUpSignInForm && <SignUpAndSignInForm onClose={() => setShowSignUpSignInForm(false)} />}
            <PostForm postDetails={postDetails} setPostDetails={setPostDetails} onSubmit={onSubmit} />
        </>
    )
}

export default CreatePostPage;
