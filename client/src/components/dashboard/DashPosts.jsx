import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';

export default function DashPosts() {
	const { currentUser } = useSelector((state) => state.user);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const res = await axios.get(`/api/post/getposts?id=${currentUser._id}`);
				setPosts(res.data.posts);
			} catch (error) {
				console.error(error.message);
			}
		}
		if (currentUser?._id) {
			fetchPosts();
		}
	}, [currentUser._id]);

	return (
		<div className="w-full overflow-x-auto p-3">
			{currentUser.isAdmin && posts.length > 0 ? (
				<Table className="border">
					{/* <TableCaption>Caption here.</TableCaption> */}
					<TableHeader>
						<TableRow>
							<TableHead>Date updated</TableHead>
							<TableHead>Post image</TableHead>
							<TableHead>Post title</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Delete</TableHead>
							<TableHead className="text-right">
								<span className="sr-only">Edit</span>{' '}
								{/* sr-only keeps it accessible but invisible if you prefer the clean look */}
								Edit
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{posts.map((post) => (
							<TableRow key={post._id}>
								<TableCell className="font-medium">
									{new Date(post.updatedAt).toLocaleDateString()}
								</TableCell>

								<TableCell>
									<Link to={`/post/${post.slug}`}>
										<img
											src={post.image}
											alt={post.title}
											className="h-10 w-20 rounded bg-gray-500 object-cover"
										/>
									</Link>
								</TableCell>

								<TableCell>
									<Link
										className="font-medium text-gray-900 hover:underline dark:text-white"
										to={`/post/${post.slug}`}
									>
										{post.title}
									</Link>
								</TableCell>

								<TableCell className="capitalize">{post.category}</TableCell>

								<TableCell>
									<span className="cursor-pointer font-medium text-red-500 hover:underline">
										Delete
									</span>
								</TableCell>

								<TableCell className="text-right">
									<Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
										Edit
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p>You have no posts yet!</p>
			)}
		</div>
	);
}
