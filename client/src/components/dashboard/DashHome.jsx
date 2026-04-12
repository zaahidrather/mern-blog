import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowUp, FileText, MessageSquareText, UsersRound } from 'lucide-react';
import { Button } from '../ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import api from '@/api/axiosInstance';

export default function DashboardComp() {
	const [users, setUsers] = useState([]);
	const [comments, setComments] = useState([]);
	const [posts, setPosts] = useState([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalPosts, setTotalPosts] = useState(0);
	const [totalComments, setTotalComments] = useState(0);
	const [lastMonthUsers, setLastMonthUsers] = useState(0);
	const [lastMonthPosts, setLastMonthPosts] = useState(0);
	const [lastMonthComments, setLastMonthComments] = useState(0);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await api.get('/user/getusers?limit=5');
				const data = res.data;

				setUsers(data.usersWithoutPassword);
				setTotalUsers(data.totalUsers);
				setLastMonthUsers(data.lastMonthUsers);
			} catch (error) {
				console.log(error.message);
			}
		};

		const fetchPosts = async () => {
			try {
				const res = await api.get('/post/getposts?limit=5');
				const data = res.data;

				setPosts(data.posts);
				setTotalPosts(data.totalPosts);
				setLastMonthPosts(data.lastMonthPosts);
			} catch (error) {
				console.log(error.message);
			}
		};

		const fetchComments = async () => {
			try {
				const res = await api.get('/comment/getcomments?limit=5');
				const data = res.data;

				setComments(data.comments);
				setTotalComments(data.totalComments);
				setLastMonthComments(data.lastMonthComments);
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchUsers();
			fetchPosts();
			fetchComments();
		}
	}, [currentUser]);

	return (
		<div className="px-3 py-4 md:mx-auto">
			<div className="grid grid-cols-3 gap-2">
				{/* Total Users */}
				<div className="flex w-full flex-col gap-4 rounded-md p-3 dark:bg-slate-800">
					<div className="flex justify-between">
						<div className="">
							<h3 className="text-md text-gray-500 uppercase">Total Users</h3>
							<p className="text-2xl">{totalUsers}</p>
						</div>
						{/* <UsersRound className="rounded-full  p-3 text-5xl text- shadow-lg" /> */}
						<UsersRound className="text-teal-600" size={24} strokeWidth={2.5} />
					</div>
					<div className="flex gap-2 text-sm">
						<span className="flex items-center text-green-500">
							<ArrowUp />
							{lastMonthUsers}
						</span>
						<div className="text-gray-500">Last month</div>
					</div>
				</div>
				{/* Total Comments */}
				<div className="flex w-full flex-col gap-4 rounded-md p-3 dark:bg-slate-800">
					<div className="flex justify-between">
						<div className="">
							<h3 className="text-md text-gray-500 uppercase">Total Comments</h3>
							<p className="text-2xl">{totalComments}</p>
						</div>
						<MessageSquareText className="text-indigo-600" size={24} strokeWidth={2.5} />
					</div>
					<div className="flex gap-2 text-sm">
						<span className="flex items-center text-green-500">
							<ArrowUp />
							{lastMonthComments}
						</span>
						<div className="text-gray-500">Last month</div>
					</div>
				</div>
				{/* Total Posts */}
				<div className="flex w-full flex-col gap-4 rounded-md p-3 dark:bg-slate-800">
					<div className="flex justify-between">
						<div className="">
							<h3 className="text-md text-gray-500 uppercase">Total Posts</h3>
							<p className="text-2xl">{totalPosts}</p>
						</div>
						<FileText className="text-lime-600" size={24} strokeWidth={2.5} />
					</div>
					<div className="flex gap-2 text-sm">
						<span className="flex items-center text-green-500">
							<ArrowUp />
							{lastMonthPosts}
						</span>
						<div className="text-gray-500">Last month</div>
					</div>
				</div>
			</div>
			<div className="mx-auto flex flex-wrap justify-center gap-4 py-3">
				<div className="flex w-full flex-col rounded-md p-2 shadow-md md:w-auto dark:bg-gray-800">
					<div className="flex justify-between p-3 text-sm font-semibold">
						<h1 className="p-2 text-center">Recent users</h1>
						<Button asChild>
							<Link to={'/dashboard?tab=users'}>See all</Link>
						</Button>
					</div>

					<Table className="border">
						<TableHeader>
							<TableRow>
								<TableHead className="pl-10">User Image</TableHead>
								<TableHead>Username</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users?.map((user) => (
								<TableRow key={user._id}>
									<TableCell className="pl-10">
										<img
											src={user.avatar.secure_url}
											alt="user"
											className="h-10 w-10 rounded-full bg-gray-500"
										/>
									</TableCell>
									<TableCell className="max-w-[300px]">{user.username}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className="flex w-full flex-col rounded-md p-2 shadow-md md:w-auto dark:bg-gray-800">
					<div className="flex justify-between p-3 text-sm font-semibold">
						<h1 className="p-2 text-center">Recent comments</h1>
						<Button asChild>
							<Link to={'/dashboard?tab=comments'}>See all</Link>
						</Button>
					</div>

					<Table className="border">
						{/* <TableCaption>Caption here.</TableCaption> */}
						<TableHeader>
							<TableRow>
								<TableHead className="pl-10">Content</TableHead>
								<TableHead>Likes</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{comments.map((comment) => (
								<TableRow key={comment._id}>
									<TableCell className="pl-10">{comment.content}</TableCell>
									<TableCell className="max-w-[300px]">{comment.numberOfLikes}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className="flex w-full flex-col rounded-md p-2 shadow-md md:w-auto dark:bg-gray-800">
					<div className="flex justify-between p-3 text-sm font-semibold">
						<h1 className="p-2 text-center">Recent posts</h1>
						<Button asChild>
							<Link to={'/dashboard?tab=posts'}>See all</Link>
						</Button>
					</div>
					<Table className="border">
						{/* <TableCaption>Caption here.</TableCaption> */}
						<TableHeader>
							<TableRow>
								<TableHead className="pl-10">Post Image</TableHead>
								<TableHead>Post Title</TableHead>
								<TableHead>Catgegory</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{posts.map((post) => (
								<TableRow key={post._id}>
									<TableCell className="pl-10">
										<img src={post.image} alt="user" className="h-10 w-14 rounded-md bg-gray-500" />
									</TableCell>
									<TableCell className="max-w-[300px]">{post.title}</TableCell>
									<TableCell>{post.category}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
