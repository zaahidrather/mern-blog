import React from 'react';
import { ThumbsUp } from 'lucide-react';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function Comment({ comment, onLike }) {
	const { currentUser } = useSelector((state) => state.user);
	// console.log('Inside comment component', comment);

	const user = comment.userId;

	return (
		<div className="flex border-b p-4 text-sm dark:border-gray-600">
			<div className="mr-3 shrink-0">
				<img
					className="h-10 w-10 rounded-full bg-gray-200"
					// Use the avatar object from your model
					src={user?.avatar?.secure_url}
					alt={user?.username}
				/>
			</div>
			<div className="flex-1">
				<div className="mb-1 flex items-center">
					<span className="mr-1 truncate text-xs font-bold">
						{user ? `@${user.username}` : 'anonymous user'}
					</span>
					<span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
				</div>
				<p className="pb-2 text-gray-500">{comment.content}</p>
				<div className="flex max-w-fit items-center gap-2 border-t pt-2 text-xs dark:border-gray-700">
					<button
						type="button"
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
				</div>
			</div>
		</div>
	);
}
