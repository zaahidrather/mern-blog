import api from '@/api/axiosInstance';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Field, FieldError } from '../ui/field';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
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
} from '@/components/ui/alert-dialog';
import { Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommentSection({ postId }) {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [commentToDelete, setCommentToDelete] = useState(null);
	const [commentError, setCommentError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const CHARACTER_LIMIT = 200;
	const isInvalid = comment.length >= CHARACTER_LIMIT;

	const navigate = useNavigate();

	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await api.get(`/comment/getPostComments/${postId}`);
				setComments(res.data);
				// console.log('comments', res.data);
			} catch (error) {
				console.log(error.message);
			}
		};
		getComments();
	}, [postId]);

	const handleChange = (e) => {
		setCommentError('');
		const newValue = e.target.value;
		// Only update state if the new length is within limits
		if (newValue.length <= CHARACTER_LIMIT) {
			setComment(newValue);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (comment.length > 200) {
			return;
		}
		if (comment.length == 0) {
			setCommentError('Please enter something first.');
			return;
		}

		const commentData = {
			content: comment,
			postId,
			user: currentUser._id,
		};

		try {
			const res = await api.post('/comment/create', commentData);

			// Create a version of the comment that matches the "populated" structure
			const newCommentPopulated = {
				...res.data,
				user: {
					_id: currentUser._id,
					username: currentUser.username,
					avatar: {
						secure_url: currentUser.avatar.secure_url,
					},
				},
			};
			// console.log('res from creating comment', res);
			setComment(''); // Clear comment form
			setCommentError(null);
			setComments([newCommentPopulated, ...comments]); // Add newly created comment to existing state of post comments
		} catch (error) {
			setCommentError(error.message);
		}
	};

	const handleLike = async (commentId) => {
		if (!currentUser) {
			navigate('/sign-in');
			return;
		}

		try {
			const res = await api.put(`/comment/likecomment/${commentId}`);
			setComments(
				comments.map((comment) =>
					comment._id == commentId
						? { ...comment, likes: res.data.likes, numberOfLikes: res.data.numberOfLikes }
						: comment,
				),
			);
		} catch (error) {
			console.log(error);
		}
	};

	const handleEdit = async (comment, editedContent) => {
		setComments(
			comments.map((c) => (c._id === comment._id ? { ...comment, content: editedContent } : c)),
		);
	};

	const handleOpenModal = (commentId) => {
		setIsModalOpen(!isModalOpen);
		setCommentToDelete(commentId);
	};

	const handleDelete = async () => {
		try {
			await api.delete(`/comment/deleteComment/${commentToDelete}`);

			toast.success('Comment deleted successfully.');
			setComments(comments.filter((comment) => comment._id !== commentToDelete));
			setIsModalOpen(false);
		} catch (error) {
			const errorMessage = error.response?.data?.message || 'Failed to delete comment';
			toast.error(errorMessage);
		}
	};

	return (
		<div className="mx-auto w-full max-w-2xl p-3">
			{/* User Sign in details */}
			{currentUser ? (
				<div className="my-5 flex items-center gap-1 text-sm text-gray-500">
					<p>Signed in as:</p>
					<img
						className="h-5 w-5 rounded-full object-cover"
						src={currentUser.profilePicture}
						alt=""
					/>
					<Link to={'/dashboard?tab=profile'} className="text-xs text-gray-600 hover:underline">
						@{currentUser.username}
					</Link>
				</div>
			) : (
				<div className="my-5 flex gap-1 text-sm">
					You must be signed in to comment.
					<Link className="text-blue-500 hover:underline" to={'/sign-in'}>
						Sign In
					</Link>
				</div>
			)}

			{/* Comments Section form */}
			{currentUser && (
				<form onSubmit={handleSubmit} className="rounded-md border p-3">
					<Field data-invalid={isInvalid}>
						<Textarea
							className="md:min-h-[100px]"
							aria-invalid={isInvalid}
							placeholder="Add a comment..."
							onChange={handleChange}
							value={comment}
						/>
					</Field>
					<div className="mt-5 flex items-center justify-between">
						{commentError ? (
							<FieldError className="text-destructive">{commentError}</FieldError>
						) : (
							<p
								className={`text-xs ${comment.length === CHARACTER_LIMIT ? 'text-destructive ' : 'text-gray-500'}`}
							>
								{CHARACTER_LIMIT - comment.length} characters remaining
							</p>
						)}
						<Button type="submit">Submit</Button>
					</div>
				</form>
			)}

			{/* Comments Section content */}
			{comments?.length === 0 ? (
				<p className="my-5 text-sm">No comments yet!</p>
			) : (
				<>
					<div className="my-5 flex items-center gap-1 text-sm font-semibold">
						<p>
							Comments <span className="text-xs font-medium">{comments?.length}</span>
						</p>
					</div>
					{comments?.map((comment) => (
						<Comment
							key={comment._id}
							comment={comment}
							setComment={setComment}
							currentUserId={currentUser._id}
							onLike={handleLike}
							onEdit={handleEdit}
							handleOpenModal={handleOpenModal}
						/>
					))}
				</>
			)}

			<AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
							<Trash2Icon />
						</AlertDialogMedia>
						<AlertDialogTitle>Delete Comment?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this comment.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
