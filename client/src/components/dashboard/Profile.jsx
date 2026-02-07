import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateProfileStart,
	updateProfileSuccess,
	updateProfileFailure,
} from '../../redux/user/userSlice.js';
import { Spinner } from '../ui/spinner';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export default function Profile() {
	const { currentUser, loading, error: errorMessage } = useSelector((state) => state.user);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [username, setUsername] = useState(currentUser.username);
	const [email, setEmail] = useState(currentUser.email);
	const filePickerRef = useRef();
	// console.log('current user', currentUser);

	const dispatch = useDispatch();

	function handleImage(e) {
		const file = e.target.files[0];
		if (file) {
			if (imageFileUrl) {
				URL.revokeObjectURL(imageFileUrl);
				console.log('URL revoked');
			}
			setImageFileUrl(URL.createObjectURL(file));
			if (imageFileUrl) console.log('imagefileurl', imageFileUrl);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const file = filePickerRef.current.files[0];
		const formData = new FormData();

		let hasChanges = false;

		if (file) {
			formData.append('profileImage', file);
			hasChanges = true;
		}

		if (username !== currentUser.username) {
			formData.append('username', username);
			hasChanges = true;
		}

		if (email !== currentUser.email) {
			formData.append('email', email);
			hasChanges = true;
		}

		if (!hasChanges) {
			console.log('No changes made');
			return;
		}
		try {
			dispatch(updateProfileStart());
			const res = await fetch('/api/user/profile', {
				method: 'PATCH',
				body: formData,
				credentials: 'include',
			});
			const data = await res.json();
			// console.log('res', res);
			console.log('data', data);
			if (res.ok) {
				dispatch(updateProfileSuccess(data));
			}

			if (!res.ok) {
				dispatch(updateProfileFailure(data.message || 'Update failed'));
				return;
			}
		} catch (error) {
			dispatch(updateProfileFailure(error.message));
		}
	}

	useEffect(() => {
		// Cleanup function when component disappears
		return () => {
			if (imageFileUrl) {
				URL.revokeObjectURL(imageFileUrl);
			}
		};
	}, [imageFileUrl]);

	return (
		<div className="mx-auto w-full max-w-lg p-3">
			<h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
			<form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-4">
				<input
					type="file"
					name="profileImage"
					onChange={handleImage}
					ref={filePickerRef}
					accept="image/*"
					hidden
				/>
				<div className="h-32 w-32 cursor-pointer self-center overflow-hidden rounded-full shadow-md">
					<img
						src={imageFileUrl || currentUser?.avatar?.secure_url}
						onError={(e) => {
							e.target.src = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
						}}
						onClick={() => filePickerRef.current.click()}
						alt="Avatar"
						className="h-full w-full rounded-full border-8 border-[lightgray] object-cover"
					/>
				</div>

				<Input
					id="username"
					name="username"
					onChange={(e) => setUsername(e.target.value)}
					value={username}
					type="text"
					placeholder="Username"
				/>
				<Input
					name="email"
					id="email"
					placeholder="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
				<Input type="password" id="password" placeholder="password" />

				<Button type="submit" variant="default">
					{loading ? (
						<>
							<Spinner /> <span>Updating Profile...</span>
						</>
					) : (
						'Update Profile'
					)}
				</Button>
				{errorMessage && (
					<Alert className="mt-5" variant="destructive">
						<AlertCircleIcon />
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				)}
			</form>
			<div className="mt-5 flex justify-between text-red-500">
				<span className="cursor-pointer">Delete Account</span>
				<span className="cursor-pointer">Sign Out</span>
			</div>
		</div>
	);
}
