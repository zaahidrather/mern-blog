import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Field, FieldError } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import api from '@/api/axiosInstance';
import toast from 'react-hot-toast';

export default function Comment({ comment, onLike, onEdit, handleOpenModal }) {
	const [editedContent, setEditedContent] = useState(comment.content);
	const [isEditing, setIsEditing] = useState(false);
	const [commentError, setCommentError] = useState(null);
	const CHARACTER_LIMIT = 200;
	const isInvalid = editedContent.length >= CHARACTER_LIMIT;
	// console.log('Inside comment component', comment);

	const { currentUser } = useSelector((state) => state.user);
	const user = comment.user;

	const handleEdit = (e) => {
		const newValue = e.target.value;

		if (newValue.length <= CHARACTER_LIMIT) {
			setEditedContent(newValue);
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();

		try {
			if (editedContent === comment.content) {
				toast.error('Please make some changes before saving!');
			} else {
				await api.patch(`/comment/editcomment/${comment._id}`, {
					content: editedContent,
				});
				onEdit(comment, editedContent);
				setIsEditing(false);
			}
		} catch (error) {
			// console.log(error);
			setCommentError(error.message);
		}
	};

	return (
		<div className="dark flex flex-col p-4 text-sm">
			<div className="flex shrink-0 items-center gap-2">
				<img
					className="h-10 w-10 rounded-full bg-gray-200"
					// Use the avatar object from your model
					src={user?.avatar?.secure_url}
					alt={user?.username}
				/>
				<div className="mb-1 flex items-center">
					<span className="mr-1 truncate text-xs font-bold">
						{user ? `@${user.username}` : 'anonymous user'}
					</span>
					<span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
				</div>
			</div>
			<div className="flex-1">
				{isEditing ? (
					<form onSubmit={onEdit} className="mt-4 rounded-md p-3">
						<Field data-invalid={isInvalid}>
							<Textarea
								className="md:min-h-[100px]"
								aria-invalid={isInvalid}
								placeholder="Add a comment..."
								onChange={handleEdit}
								value={editedContent}
							/>
							{commentError && <FieldError className="text-destructive">{commentError}</FieldError>}
						</Field>
						<div className="mt-5 flex items-center justify-between">
							<p
								className={`text-xs ${comment.length === CHARACTER_LIMIT ? 'text-destructive ' : 'text-gray-500'}`}
							>
								{CHARACTER_LIMIT - editedContent.length} characters remaining
							</p>
							<div className="flex gap-2">
								<Button variant="muted" onClick={() => setIsEditing(!isEditing)} type="button">
									Cancel
								</Button>
								<Button variant="default" onClick={handleSave} type="button">
									Save
								</Button>
							</div>
						</div>
					</form>
				) : (
					<p className="mt-2 pb-2 text-gray-300">{comment?.content}</p>
				)}

				{/* Buttons */}
				{!isEditing && (
					<div className="flex max-w-fit items-center gap-2 pt-2 text-xs dark:border-gray-700">
						<button
							type="button"
							title={currentUser && comment.likes.includes(currentUser._id) ? 'Undo Like' : 'Like'}
							onClick={() => onLike(comment._id)}
							className={`text-gray-400 hover:text-blue-500 ${
								currentUser && comment.likes.includes(currentUser._id) && 'text-blue-500!'
							}`}
						>
							<ThumbsUp size={18} />
						</button>
						<p className="text-gray-400">
							{comment.numberOfLikes > 0 &&
								comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
						</p>

						{(currentUser?.isAdmin || currentUser?._id === comment.user._id) && (
							<>
								<button
									type="button"
									className="cursor-pointer border-none"
									title="Edit this comment"
									onClick={() => setIsEditing(!isEditing)}
								>
									Edit
								</button>
								<button
									type="button"
									className="cursor-pointer border-none"
									title="Edit this comment"
									onClick={() => handleOpenModal(comment._id)}
								>
									Delete
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
