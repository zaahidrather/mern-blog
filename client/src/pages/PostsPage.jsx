import api from '@/api/axiosInstance';
import CallToAction from '@/components/common/CallToAction';
import Loader from '@/components/common/Loader';
import PostCard from '@/components/common/PostCard';
import CommentsSection from '@/components/dashboard/CommentsSection';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Link, useNavigationType, useParams } from 'react-router-dom';

export default function PostPage() {
	const { postSlug } = useParams();
	const [post, setPost] = useState(null);
	const [recentPosts, setRecentPosts] = useState(null);
	const [loading, setLoading] = useState(true);
	const navType = useNavigationType(); // Detects 'PUSH', 'POP', or 'REPLACE'

	// Fetch posts
	useEffect(() => {
		// Only scroll to top if the user is navigating TO the page (PUSH)
		// If navType is 'POP', it means they hit the Back button, so we stay put.
		if (navType !== 'POP') {
			window.scrollTo(0, 0);
			console.log('not pop');
		}
		async function fetchPost() {
			try {
				setLoading(true); // Reset loading on slug change
				const res = await api.get(`/post/getposts?slug=${postSlug}`);
				// const fetchedPost = res.data.posts[0];
				// console.log('fetched : ', res.data);
				if (res.data.posts.length > 0) {
					setPost(res.data.posts[0]);
				} else {
					setPost(null); // Explicitly null if not found
				}
				setLoading(false);
				// setPost(fetchedPost);
				// console.log('fetchedpost', fetchedPost);
			} catch (error) {
				console.error(error.message);
				setLoading(false);
			}
		}

		fetchPost();
	}, [postSlug, navType]);

	// Fetch recent posts
	useEffect(() => {
		try {
			const fetchRecentPosts = async () => {
				const res = await fetch(`/api/post/getposts?limit=3`);
				const data = await res.json();
				if (res.ok) {
					setRecentPosts(data.posts);
				}
			};
			fetchRecentPosts();
		} catch (error) {
			console.log(error.message);
		}
	}, []);

	if (loading) {
		return <Loader />;
	}

	if (!post) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-3 text-center">
				<h2 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">404</h2>
				<p className="mb-6 text-xl text-gray-500">
					The article you are looking for doesn't exist or has been removed.
				</p>
				<Link to="/search">
					<Button variant="outline">Browse other articles</Button>
				</Link>
			</div>
		);
	}

	return (
		<main className="mx-auto flex min-h-screen max-w-6xl flex-col p-3">
			<h1 className="mx-auto mt-10 max-w-2xl p-3 text-center font-serif text-3xl lg:text-4xl">
				{post && post.title}
			</h1>
			<Link to={`/search?category=${post && post.category}`} className="mt-5 self-center">
				<Button color="gray" size="xs">
					{post && `${post.category.charAt(0).toUpperCase()}${post.category.slice(1)}`}
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
				className="post-content break-word mx-auto w-full max-w-2xl p-3 wrap-break-word"
				dangerouslySetInnerHTML={{ __html: post && post.content }}
			></div>
			<div className="mx-auto w-full max-w-4xl">
				<CallToAction />
			</div>
			<CommentsSection postId={post?._id} />
			<div className="mb-5 flex flex-col items-center justify-center">
				<h1 className="mt-5 text-xl">Recent articles</h1>
				<div className="mt-5 grid grid-cols-1 justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
				</div>
			</div>
		</main>
	);
}
