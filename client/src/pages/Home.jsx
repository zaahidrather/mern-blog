import api from '@/api/axiosInstance';
import CallToAction from '@/components/common/CallToAction';
import PostCard from '@/components/common/PostCard';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			// const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getPosts`);
			// const data = await res.json();
			const res = await api.get('/post/getPosts');
			setPosts(res.data.posts);
		};
		fetchPosts();
	}, []);

	return (
		<div>
			<div className="mx-auto flex max-w-6xl flex-col gap-6 p-10 px-3">
				<h1 className="pt-10 text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
				<p className="text-xs text-gray-500 sm:text-sm">
					Welcome to my blog! Here you'll find a wide range of articles, tutorials, and resources
					designed to help you grow as a developer. Whether you're interested in web development,
					software engineering, programming languages, or best practices in the tech industry,
					there's something here for everyone. Dive in and explore the content to expand your
					knowledge and skills.
				</p>
				<Link to="/search" className="text-xs font-bold text-teal-500 hover:underline sm:text-sm">
					View all posts
				</Link>

				<CallToAction />
			</div>

			<div className="mx-auto flex max-w-6xl flex-col gap-8 p-3 py-3">
				{posts && posts.length > 0 && (
					<div className="flex flex-col gap-6">
						<h2 className="text-center text-2xl font-semibold">Recent Posts</h2>
						<div className="flex flex-wrap gap-3">
							{posts.map((post) => (
								<PostCard key={post._id} post={post} />
							))}
						</div>
						<Link to={'/search'} className="text-center text-lg text-teal-500 hover:underline">
							View all posts
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
