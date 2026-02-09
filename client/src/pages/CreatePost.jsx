import React, { Suspense } from 'react';
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

export default function CreatePost() {
	return (
		<div className="mx-auto min-h-screen max-w-3xl p-3">
			<h1 className="my-7 text-center text-3xl font-semibold">Create a post</h1>
			<form className="flex flex-col gap-4">
				<div className="flex flex-col justify-between gap-4 sm:flex-row">
					<Input placeholder="Title" required id="title" className="flex-1" />
					<Select>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a category" />
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
				<div className="flex items-center justify-between gap-4 border-4 border-dotted p-3">
					<Field>
						<FieldLabel htmlFor="picture">Image</FieldLabel>
						<Input id="picture" type="file" accept="image/*" />
					</Field>
				</div>
				<ErrorBoundary
					FallbackComponent={ErrorFallback}
					onReset={() => {
						window.location.reload();
					}}
				>
					<Suspense fallback={<div>Loading...</div>}>
						<ReactQuill
							theme="snow"
							placeholder="Write something..."
							className="mb-12 h-72"
							required
						/>
					</Suspense>
				</ErrorBoundary>
				<Button type="submit">Publish</Button>
			</form>
		</div>
	);
}
