import { signoutSuccess } from '@/redux/user/userSlice';
import { ArrowRight, FileText, User, UsersRound } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
	const { search } = useLocation();
	const urlSearchParams = new URLSearchParams(search);
	const activeTab = urlSearchParams.get('tab');
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	const isActive = (tab) => (tab == activeTab ? 'bg-gray-500' : '');

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

	return (
		<aside className="h-screen w-64 border border-white p-4">
			<h2 className="mb-6 text-xl font-semibold">Dashboard</h2>

			<nav className="space-y-2">
				<Link
					to="/dashboard?tab=profile"
					className={`flex items-center gap-2 rounded px-4 py-2 ${isActive('profile')}`}
				>
					<User /> Profile
					<span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-600 uppercase">
						{currentUser.isAdmin ? 'Admin' : 'User'}
					</span>
				</Link>
				{currentUser.isAdmin && (
					<Link
						to="/dashboard?tab=posts"
						className={`flex gap-2 rounded px-4 py-2 ${isActive('posts')}`}
					>
						<FileText /> Posts
					</Link>
				)}
				{currentUser.isAdmin && (
					<Link
						to="/dashboard?tab=users"
						className={`flex gap-2 rounded px-4 py-2 ${isActive('posts')}`}
					>
						<UsersRound /> Users
					</Link>
				)}
				<button
					onClick={handleSignout}
					className={`flex w-full gap-2 rounded px-4 py-2 ${isActive('')}`}
				>
					<ArrowRight /> Signout
				</button>
			</nav>
		</aside>
	);
}
