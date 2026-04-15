import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axiosInstance';

export default function DashPosts() {
	const { currentUser } = useSelector((state) => state.user);
	const [posts, setPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const res = await api.get(`/post/getposts?id=${currentUser._id}`);
				setPosts(res.data.posts);
				if (res.data.posts.length < 9) {
					setShowMore(false);
				}
			} catch (error) {
				console.error(error.message);
			}
		}
		if (currentUser?._id) {
			fetchPosts();
		}
	}, [currentUser._id]);

	// Show more posts
	async function handleShowMore() {
		const startIndex = posts.length;
		const res = await api.get(`/post/getposts?id=${currentUser._id}&startIndex=${startIndex}`);
		setPosts((prev) => [...prev, ...res.data.posts]);
		if (res.data.posts.length < 9) {
			setShowMore(false);
		}
	}

	// Delete post
	async function handleDelete(postId) {
		const deletePromise = api.delete(`/post/deletepost/${postId}/${currentUser._id}`);

		toast.promise(deletePromise, {
			loading: 'Deleting post...',
			success: () => {
				// Update the UI state after success
				setPosts((prev) => prev.filter((post) => post._id !== postId));
				return 'Post deleted successfully!';
			},
			error: (err) => err.response?.data?.message || 'Could not delete post.',
		});
	}

	return (
		<div className="w-full overflow-x-auto p-3">
			{currentUser.isAdmin && posts.length > 0 ? (
				<>
					<Table className="border">
						{/* <TableCaption>Caption here.</TableCaption> */}
						<TableHeader>
							<TableRow>
								<TableHead className="pl-10">Date updated</TableHead>
								<TableHead>Post image</TableHead>
								<TableHead>Post title</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Delete</TableHead>
								<TableHead className="">
									<span className="sr-only">Edit</span> Edit
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{posts.map((post) => (
								<TableRow key={post._id}>
									<TableCell className="pl-10">
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
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<span className="cursor-pointer font-medium text-red-500 hover:underline">
													Delete
												</span>
											</AlertDialogTrigger>
											<AlertDialogContent size="sm">
												<AlertDialogHeader>
													<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
														<Trash2Icon />
													</AlertDialogMedia>
													<AlertDialogTitle>Delete Post?</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete this post.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
													<AlertDialogAction
														variant="destructive"
														onClick={() => handleDelete(post._id)}
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</TableCell>

									<TableCell>
										<Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
											Edit
										</Link>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{showMore && (
						<button
							onClick={handleShowMore}
							className="w-full self-center py-7 text-sm text-teal-500"
						>
							Show more
						</button>
					)}
				</>
			) : (
				<p>You have no posts yet!</p>
			)}
		</div>
	);
}
