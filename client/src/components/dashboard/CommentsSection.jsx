import api from '@/api/axiosInstance';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Field, FieldError } from '../ui/field';
import Comment from './Comment';

export default function CommentSection({ postId }) {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [commentError, setCommentError] = useState(null);
	const CHARACTER_LIMIT = 200;
	const isInvalid = comment.length >= CHARACTER_LIMIT;

	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await api.get(`/comment/getPostComments/${postId}`);
				setComments(res.data);
			} catch (error) {
				console.log(error.message);
			}
		};
		getComments();
	}, [postId]);

	const handleChange = (e) => {
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

		const commentData = {
			content: comment,
			postId,
			userId: currentUser._id,
		};

		try {
			const res = await api.post('/comment/create', commentData);

			console.log('res from creating comment', res);
			setComment(''); // Clear comment form
			setCommentError(null);
			setComments([res.data, ...comments]); // Add newly created comment to existing state of post comments
		} catch (error) {
			setCommentError(error.message);
		}
	};
	return (
		<div className="mx-auto w-full max-w-2xl p-3">
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
						{commentError && <FieldError className="text-destructive">{commentError}</FieldError>}
					</Field>
					<div className="mt-5 flex items-center justify-between">
						<p
							className={`text-xs ${comment.length === CHARACTER_LIMIT ? 'text-destructive ' : 'text-gray-500'}`}
						>
							{CHARACTER_LIMIT - comment.length} characters remaining
						</p>
						<Button type="submit">Submit</Button>
					</div>
				</form>
			)}
			{comments?.length === 0 ? (
				<p className="my-5 text-sm">No comments yet!</p>
			) : (
				<>
					<div className="my-5 flex items-center gap-1 text-sm">
						<p>Comments</p>
						<div className="rounded-sm border border-gray-400 px-2 py-1">
							<p>{comments?.length}</p>
						</div>
					</div>
					{comments?.map((comment) => (
						<Comment key={comment._id} comment={comment} />
					))}
				</>
			)}
		</div>
	);
}
