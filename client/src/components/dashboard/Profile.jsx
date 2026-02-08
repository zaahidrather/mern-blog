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

export default function Profile() {
	const { currentUser, loading, error: errorMessage } = useSelector((state) => state.user);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
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
			if (imageFileUrl) console.log('imagefileurl', imageFileUrl);
		}
	}

	function handleChange(e) {
		// Clear Redux errors
		if (errorMessage) {
			dispatch(clearError());
		}
		// Clear the local success message
		if (updateSuccessMessage) {
			setUpdateSuccessMessage(null);
		}
		setFormData({ ...formData, [e.target.name]: e.target.value });
		// console.log('formdata', formData);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (errorMessage) {
			dispatch(clearError());
		}
		if (updateSuccessMessage) {
			setUpdateSuccessMessage(null);
		}
		const file = filePickerRef.current.files[0];
		const dataToSend = new FormData();

		// Add File (if any)
		if (file) {
			dataToSend.append('profileImage', file);
		}

		// Add changed text fields from our 'formData' state
		Object.keys(formData).forEach((key) => {
			if (formData[key] !== currentUser[key]) dataToSend.append(key, formData[key]);
		});

		// Final Check: Did anything actually get put in the dataToSend ?
		const hasChanges = Array.from(dataToSend.entries()).length !== 0;

		if (!hasChanges) {
			dispatch(updateProfileFailure('No changes made'));
			return;
		}
		try {
			dispatch(clearError());
			dispatch(updateProfileStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'PATCH',
				body: dataToSend,
			});
			const data = await res.json();
			// console.log('res', res);
			console.log('data', data);
			if (res.ok) {
				dispatch(updateProfileSuccess(data));
				setUpdateSuccessMessage("User's profile updated successfully.");
			}

			if (!res.ok) {
				dispatch(updateProfileFailure(data.message || 'Update failed'));
				return;
			}
		} catch (error) {
			dispatch(updateProfileFailure(error.message));
		}
	}

	async function handleDelete() {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE',
			});
			if (res.ok) {
				dispatch(deleteUserSuccess());
			} else {
				// dispatch(deleteUserFailure(res));
				console.log('failed to delete');
			}
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	}

	async function handleSignout() {
		try {
			const res = await fetch('/api/user/signout', {
				method: 'POST',
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signoutSuccess());
			}
		} catch (error) {
			console.log('failed to signout', error);
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
			</form>
			{errorMessage && (
				<Alert className="mt-5" variant="destructive">
					<AlertCircleIcon />
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}
			{updateSuccessMessage && (
				<Alert className="mt-5" variant="success">
					<AlertCircleIcon />
					<AlertDescription>{updateSuccessMessage}</AlertDescription>
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
