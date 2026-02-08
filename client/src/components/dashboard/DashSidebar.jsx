import { signoutSuccess } from '@/redux/user/userSlice';
import { ArrowRight, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

export default function DashSidebar() {
	const { search } = useLocation();
	const urlSearchParams = new URLSearchParams(search);
	const activeTab = urlSearchParams.get('tab');
	const dispatch = useDispatch();

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
					className={`flex gap-2 rounded px-4 py-2 ${isActive('profile')}`}
				>
					<User /> Profile
				</Link>
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
