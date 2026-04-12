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

export default function DashComments() {
	const { currentUser } = useSelector((state) => state.user);
	const [comments, setComments] = useState([]);
	const [showMore, setShowMore] = useState(true);

	useEffect(() => {
		async function fetchComments() {
			try {
				const res = await api.get(`/comment/getComments`);
				setComments(res.data.comments);
				// console.log('res,', res);
				if (res.data.comments.length < 9) {
					setShowMore(false);
				}
			} catch (error) {
				console.error(error.message);
			}
		}
		if (currentUser?._id) {
			fetchComments();
		}
	}, [currentUser._id]);

	// Show more comments
	async function handleShowMore() {
		const startIndex = comments.length;
		const res = await api.get(
			`/comment/getComments?id=${currentUser._id}&startIndex=${startIndex}`,
		);

		setComments((prev) => [...prev, ...res.data.comments]);
		if (res.data.comments.length < 9) {
			setShowMore(false);
		}
	}

	// Delete comment
	async function handleDelete(commentId) {
		const deletePromise = api.delete(`/comment/deleteComment/${commentId}`);

		toast.promise(deletePromise, {
			loading: 'Deleting comment...',
			success: () => {
				// Update the UI state after success
				setComments((prev) => prev.filter((comment) => comment._id !== commentId));
				return 'Comment deleted successfully!';
			},
			error: (err) => err.response?.data?.message || 'Could not delete comment.',
		});
	}

	return (
		<div className="w-full overflow-x-auto p-3">
			{currentUser.isAdmin && comments.length > 0 ? (
				<>
					<Table className="border">
						{/* <TableCaption>Caption here.</TableCaption> */}
						<TableHeader>
							<TableRow>
								<TableHead className="pl-10">Date updated</TableHead>
								<TableHead>Comment content</TableHead>
								<TableHead>Number of likes</TableHead>
								<TableHead>Post id</TableHead>
								<TableHead>User id</TableHead>
								<TableHead>Delete</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{comments.map((comment) => (
								<TableRow key={comment._id}>
									<TableCell className="pl-10">
										{new Date(comment.updatedAt).toLocaleDateString()}
									</TableCell>

									<TableCell className="max-w-[300px]">
										<Link className="line-clamp-2 break-words text-gray-900 dark:text-white">
											{comment.content}
										</Link>
									</TableCell>

									<TableCell>{comment.numberOfLikes}</TableCell>

									<TableCell>{comment.postId}</TableCell>
									<TableCell>{comment.user}</TableCell>

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
													<AlertDialogTitle>Delete comment?</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete this comment.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
													<AlertDialogAction
														variant="destructive"
														onClick={() => handleDelete(comment._id)}
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
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
				<p>You have no comments yet!</p>
			)}
		</div>
	);
}
