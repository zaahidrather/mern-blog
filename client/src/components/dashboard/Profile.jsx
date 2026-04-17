import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateProfileStart,
	updateProfileSuccess,
	updateProfileFailure,
	clearError,
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
	signoutSuccess,
} from '../../redux/user/userSlice.js';
import { Spinner } from '../ui/spinner';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircleIcon, Pencil } from 'lucide-react';
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
import { Link } from 'react-router-dom';
import api from '@/api/axiosInstance';

export default function Profile() {
	const { currentUser, loading, error: errorMessage } = useSelector((state) => state.user);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [statusMessage, setStatusMessage] = useState(null);
	const [formData, setFormData] = useState({
		username: currentUser.username,
		email: currentUser.email,
		password: '',
	});
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

			if (imageFileUrl) {
				console.log('imagefileurl', imageFileUrl);
			}
		}
	}

	function handleChange(e) {
		// Clear Redux errors
		if (errorMessage) {
			dispatch(clearError());
		}
		// Clear the local success message
		if (statusMessage) {
			setStatusMessage(null);
		}
		setFormData({ ...formData, [e.target.name]: e.target.value });
		// console.log('formdata', formData);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		// 1. Reset previous messages
		if (errorMessage) dispatch(clearError());
		if (statusMessage) setStatusMessage(null);

		const file = filePickerRef.current.files[0];
		const dataToSend = new FormData();

		// 2. Build FormData
		if (file) {
			dataToSend.append('profileImage', file);
		}

		Object.keys(formData).forEach((key) => {
			if (formData[key] !== currentUser[key] && formData[key] !== '') {
				dataToSend.append(key, formData[key]);
			}
		});

		// 3. Check for changes
		if (Array.from(dataToSend.entries()).length === 0) {
			dispatch(updateProfileFailure('No changes made'));
			return;
		}

		try {
			dispatch(updateProfileStart());

			// 4. Axios Request
			const res = await api.patch(`/user/update/${currentUser._id}`, dataToSend, {});

			// 5. Success Handling
			dispatch(updateProfileSuccess(res.data));
			setStatusMessage("User's profile updated successfully.");
		} catch (error) {
			// 6. Error Handling
			const status = error.response?.status;

			if (status !== 401 && status !== 403) {
				const errorMsg = error.response?.data?.message || error.message;
				dispatch(updateProfileFailure(errorMsg));
			}
		}
	}

	async function handleDelete() {
		try {
			dispatch(deleteUserStart());

			await api.delete(`/user/delete/${currentUser._id}`);

			dispatch(deleteUserSuccess());
		} catch (error) {
			const status = error.response?.status;

			if (status !== 401 && status !== 403) {
				const errorMessage = error.response?.data?.message || error.message;
				dispatch(deleteUserFailure(errorMessage));
			}
		}
	}

	async function handleSignout() {
		try {
			await api.post('/user/signout');

			// If the request is successful, the interceptor does nothing.
			// We manually dispatch here for a intentional logout.
			dispatch(signoutSuccess());
		} catch (error) {
			// If this call fails with a 401/403,
			// Axios interceptor will automatically trigger signoutSuccess()!
			console.log('Failed to signout', error.response?.data?.message);
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
				<div className="group relative h-32 w-32 cursor-pointer self-center overflow-hidden rounded-full shadow-md">
					{/* Overlay */}
					<div
						className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black opacity-0 group-hover:opacity-80"
						onClick={() => filePickerRef.current.click()}
					>
						<Pencil
							className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
							size={40}
						/>
						<div className="text-[10px] font-bold tracking-wider uppercase">Change</div>
					</div>
					<img
						src={imageFileUrl || currentUser?.avatar?.secure_url}
						onError={(e) => {
							e.target.src = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
						}}
						alt="Avatar"
						className="h-full w-full rounded-full border-8 border-[lightgray] object-cover"
					/>
				</div>

				<Input
					id="username"
					name="username"
					onChange={handleChange}
					value={formData.username}
					type="text"
					placeholder="Username"
				/>
				<Input
					name="email"
					id="email"
					onChange={handleChange}
					value={formData.email}
					type="email"
					placeholder="email"
				/>
				<Input
					name="password"
					type="password"
					id="password"
					placeholder="password"
					onChange={handleChange}
					value={formData.password}
				/>

				<Button type="submit" variant="default">
					{loading ? (
						<>
							<Spinner /> <span>Updating Profile...</span>
						</>
					) : (
						'Update Profile'
					)}
				</Button>
				{currentUser.isAdmin && (
					<Link to="/create-post">
						<Button className="w-full" type="button" variant="secondary">
							Create a post
						</Button>
					</Link>
				)}
			</form>
			{errorMessage && (
				<Alert className="mt-5" variant="destructive">
					<AlertCircleIcon />
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}
			{statusMessage && (
				<Alert className="mt-5" variant="success">
					<AlertCircleIcon />
					<AlertDescription>{statusMessage}</AlertDescription>
				</Alert>
			)}
			<div className="mt-5 flex justify-between text-red-500">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						{<span className="cursor-pointer">Delete account</span>}
					</AlertDialogTrigger>
					<AlertDialogContent size="sm">
						<AlertDialogHeader>
							<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
								<Trash2Icon />
							</AlertDialogMedia>
							<AlertDialogTitle>Delete Account?</AlertDialogTitle>
							<AlertDialogDescription>
								This action will permanently delete this user account and all associated data. This
								cannot be undone.
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

				<span onClick={handleSignout} className="cursor-pointer">
					Sign Out
				</span>
			</div>
		</div>
	);
}
