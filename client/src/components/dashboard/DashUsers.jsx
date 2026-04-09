import React, { useEffect, useState } from 'react';
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
import { Check, CircleX, Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axiosInstance';

export default function DashUsers() {
	const { currentUser } = useSelector((state) => state.user);
	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);

	useEffect(() => {
		async function fetchUsers() {
			try {
				const res = await api.get('/user/getusers');
				// const { usersWithoutPassword, totalUsers, lastMonthUsers } = res.data;
				const { usersWithoutPassword: fetchedUsers } = res.data;
				// console.log('res', res);
				setUsers(fetchedUsers);
				if (res.data.usersWithoutPassword.length < 9) {
					setShowMore(false);
				}
			} catch (error) {
				console.error(error.message);
			}
		}
		if (currentUser?.isAdmin) {
			fetchUsers();
		}
	}, [currentUser?._id, currentUser?.isAdmin]);

	// Show more users
	async function handleShowMore() {
		const startIndex = users.length;
		const res = await api.get(`/user/getusers?startIndex=${startIndex}`);
		setUsers((prev) => [...prev, ...res.data.users]);
		if (res.data.users.length < 9) {
			setShowMore(false);
		}
	}

	// Delete user
	async function handleDelete(userId) {
		const deletePromise = api.delete(`/user/delete/${userId}`);

		toast.promise(deletePromise, {
			loading: 'Deleting user...',
			success: () => {
				// Update the UI state after success
				setUsers((prev) => prev.filter((user) => user._id !== userId));
				return 'User deleted successfully!';
			},
			error: (err) => err.response?.data?.message || 'Could not delete the user.',
		});
	}
	// return <h1>hello</h1>;

	return (
		<div className="w-full overflow-x-auto p-3">
			{currentUser.isAdmin && users.length > 0 ? (
				<>
					<Table className="border">
						{/* <TableCaption>Caption here.</TableCaption> */}
						<TableHeader>
							<TableRow>
								<TableHead>Date created</TableHead>
								<TableHead>User image</TableHead>
								<TableHead>Username</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Admin</TableHead>
								<TableHead>Delete</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user._id}>
									<TableCell className="font-medium">
										{new Date(user.createdAt).toLocaleDateString()}
									</TableCell>

									<TableCell>
										<img
											src={user.avatar.secure_url}
											alt={user.username}
											className="h-10 w-10 rounded-full bg-gray-500 object-cover"
										/>
									</TableCell>

									<TableCell>{user.username}</TableCell>

									<TableCell className="capitalize">{user.email}</TableCell>
									<TableCell className="capitalize">
										{user.isAdmin ? (
											<Check className="text-green-500" />
										) : (
											<CircleX className="text-red-700" />
										)}
									</TableCell>

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
													<AlertDialogTitle>Delete User?</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete this user.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
													<AlertDialogAction
														variant="destructive"
														onClick={() => handleDelete(user._id)}
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
				<p>You have no users yet!</p>
			)}
		</div>
	);
}
