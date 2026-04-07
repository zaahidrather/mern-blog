import React, { Suspense, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
const ReactQuill = React.lazy(() => import('react-quill-new'));
import 'react-quill-new/dist/quill.snow.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/common/ErrorFallback';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
// import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
	const filePickerRef = useRef();
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadError, setUploadError] = useState(null);
	const [publishError, setPublishError] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [postData, setPostData] = useState({
		title: null,
		content: null,
		image: null,
		category: 'uncategorized',
	});
	// const navigate = useNavigate();

	async function handleImage() {
		const file = selectedFile;
		if (!file) return;

		const imageUploadData = new FormData();

		try {
			setIsUploading(true);

			// 1. Get Signature
			const { data } = await axios.get('/api/post/sign-upload');
			const { apiKey, timestamp, signature, cloudName } = data;

			// 2. Prepare Cloudinary Data
			imageUploadData.append('file', file);
			imageUploadData.append('api_key', apiKey);
			imageUploadData.append('timestamp', timestamp);
			imageUploadData.append('signature', signature);
			imageUploadData.append('folder', 'mern-blog/posts');
			// if (data) console.log('data from sign-upload api', data);

			// 3. Upload directly to Cloudinary
			const res = await axios.post(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				imageUploadData,
				{
					onUploadProgress: (progressEvent) => {
						const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						setUploadProgress(percentage);
					},
				},
			);

			// Success
			setPostData((prev) => ({ ...prev, image: res.data.secure_url }));
		} catch (error) {
			const errorMsg =
				error.response?.data?.error?.message || // Cloudinary error format
				error.response?.data?.message || // My Backend error format
				error.message; // Network/Logic error

			setUploadError(`Image Upload Failed: ${errorMsg}`);

			// Reset preview so user knows it didn't save
			setImageFileUrl(null);
			setPostData((prev) => ({ ...prev, image: null }));
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setPostData((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			setUploadError(null);
			setPublishError(null);

			await axios.post('/api/post/create', postData);
			toast.success('Post published successfully!');
			setPostData({
				title: '',
				content: '',
				image: null,
				category: 'uncategorized',
			});
			// navigate(`/post/${slug}`);
		} catch (error) {
			if (error.response) {
				// The server responded with a status outside 2xx (e.g., 400, 403, 500)
				setPublishError(` ${error.response.data.message}`);
			} else if (error.request) {
				// The request was made but no response was received (Network error)
				setPublishError('Network Error: No response from server');
			} else {
				// Something happened in setting up the request
				setPublishError(`Error: ${error.message}`);
			}
		}
	}

	return (
		<div className="mx-auto min-h-screen max-w-3xl p-3">
			<h1 className="my-7 text-center text-3xl font-semibold">Create a post</h1>
			<form className="flex flex-col gap-4">
				{/* Title */}
				<div className="flex flex-col justify-between gap-4 sm:flex-row">
					<Input
						placeholder="Title"
						required
						id="title"
						name="title"
						onChange={handleChange}
						value={postData.title ?? ''}
						className="flex-1"
					/>
					<Select
						value={postData.category}
						onValueChange={(value) =>
							setPostData((prev) => ({
								...prev,
								category: value,
							}))
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="uncategorized">Select a category</SelectItem>
								<SelectItem value="javascript">Javascript</SelectItem>
								<SelectItem value="reactjs">ReactJs</SelectItem>
								<SelectItem value="nextjs">NextJs</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				{/* Image */}
				<div className="flex items-center justify-between gap-4 border-4 border-dotted p-3">
					<Field>
						<FieldLabel htmlFor="picture">Image</FieldLabel>
						<div className="flex items-center gap-x-2">
							<Input
								id="picture"
								onChange={(e) => {
									const file = e.target.files[0];
									if (!file) return;
									setSelectedFile(file); // Store for upload
									if (imageFileUrl) URL.revokeObjectURL(imageFileUrl);
									setImageFileUrl(URL.createObjectURL(file)); //  instant preview
									setUploadError(null);
								}}
								type="file"
								accept="image/*"
								ref={filePickerRef}
								className="hidden"
							/>
							<Button
								type="button"
								disabled={isUploading}
								onClick={() => filePickerRef.current.click()}
							>
								Select Image
							</Button>

							<Button
								type="button"
								className="w-36"
								disabled={!selectedFile || isUploading}
								onClick={handleImage}
							>
								{isUploading ? (
									<>
										<Spinner /> <span>Uploading</span>
									</>
								) : (
									'Upload Image'
								)}
							</Button>
							{selectedFile ? (
								<p className="text-sm text-gray-500">
									{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
								</p>
							) : (
								<p className="text-sm text-gray-500">No file selected</p>
							)}
						</div>
						<div className="relative h-40 w-40">
							{isUploading ? (
								<div className="flex h-full w-full items-center justify-center bg-gray-800">
									{/* Progress UI */}
									<div className="flex flex-col items-center">
										<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
										<p className="mt-2 text-sm">{uploadProgress}%</p>
									</div>
								</div>
							) : (
								imageFileUrl && (
									<img src={imageFileUrl} alt="" className="h-full w-full object-cover" />
								)
							)}
						</div>
						{uploadError && (
							<Alert className="mt-5" variant="destructive">
								<AlertCircleIcon />
								<AlertDescription>{uploadError}</AlertDescription>
							</Alert>
						)}
					</Field>
				</div>
				<ErrorBoundary
					FallbackComponent={ErrorFallback}
					onReset={() => {
						window.location.reload();
					}}
				>
					<Suspense
						fallback={
							<div className="h-84 animate-pulse">
								{/* Mock Toolbar */}
								<div className="flex gap-2 bg-gray-50 p-2">
									<div className="h-6 w-6 rounded bg-gray-200" />
									<div className="h-6 w-6 rounded bg-gray-200" />
									<div className="ml-4 h-6 w-20 rounded bg-gray-200" /> {/* Dropdown mock */}
									<div className="ml-auto h-6 w-6 rounded bg-gray-200" />
								</div>

								{/* Mock Content Area */}
								<div className="h-72 p-4">
									<div className="mb-4 h-4 w-3/4 rounded bg-gray-100" />
									<div className="mb-4 h-4 w-1/2 rounded bg-gray-100" />
									<div className="h-4 w-5/6 rounded bg-gray-100" />
								</div>
							</div>
						}
					>
						<ReactQuill
							value={postData.content ?? ''}
							theme="snow"
							placeholder="Write something..."
							className="mb-12 h-72"
							required
							onChange={(value) =>
								setPostData((prev) => ({
									...prev,
									content: value,
								}))
							}
						/>
					</Suspense>
				</ErrorBoundary>
				<Button type="submit" onClick={handleSubmit}>
					Publish
				</Button>
				{publishError && (
					<Alert className="mt-5" variant="destructive">
						<AlertCircleIcon />
						<AlertDescription>{publishError}</AlertDescription>
					</Alert>
				)}
			</form>
		</div>
	);
}
