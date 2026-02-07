import { ArrowRight, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function DashSidebar() {
	const { search } = useLocation();
	const urlSearchParams = new URLSearchParams(search);
	const activeTab = urlSearchParams.get('tab');

	const isActive = (tab) => (tab == activeTab ? 'bg-gray-500' : '');

	return (
		<aside className="h-screen w-64 border border-white p-4">
			<h2 className="mb-6 text-xl font-semibold">Dashboard</h2>

			<nav className="space-y-2 [&>div]:text-red-200">
				<Link
					to="/dashboard?tab=profile"
					className={`flex gap-2 rounded px-4 py-2 ${isActive('profile')}`}
				>
					<User /> Profile
				</Link>
				<Link to="" className={`flex gap-2 rounded px-4 py-2 ${isActive('')}`}>
					<ArrowRight /> Signout
				</Link>
			</nav>
		</aside>
	);
}
