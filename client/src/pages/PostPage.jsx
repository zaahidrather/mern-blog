import api from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function PostPage() {
	const { postSlug } = useParams();
	const [post, setPost] = useState(null);

	useEffect(() => {
		async function fetchPost() {
			try {
				const res = await api.get(`/post/getposts?slug=${postSlug}`);
				const fetchedPost = res.data.posts[0];
				setPost(fetchedPost);
				console.log('fetchedpost', fetchedPost);
			} catch (error) {
				console.error(error.message);
			}
		}

		fetchPost();
	}, [postSlug]);

	return (
		<main className="mx-auto flex min-h-screen max-w-6xl flex-col p-3">
			<h1 className="mx-auto mt-10 max-w-2xl p-3 text-center font-serif text-3xl lg:text-4xl">
				{post && post.title}
			</h1>
			<Link to={`/search?category=${post && post.category}`} className="mt-5 self-center">
				<Button color="gray" size="xs">
					{post && post.category}
				</Button>
			</Link>
			<img
				src={post && post.image}
				alt={post && post.title}
				className="mt-10 max-h-[600px] w-full object-cover p-3"
			/>
			<div className="mx-auto flex w-full max-w-2xl justify-between border-b border-slate-500 p-3 text-xs">
				<span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
				<span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
			</div>
			<div
				className="post-content md:break-word mx-auto w-full max-w-2xl p-3 break-normal wrap-normal md:wrap-break-word"
				dangerouslySetInnerHTML={{ __html: post && post.content }}
			></div>
		</main>
	);
}
