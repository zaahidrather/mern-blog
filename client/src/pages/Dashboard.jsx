import DashSidebar from '@/components/dashboard/DashSidebar';
import Profile from '@/components/dashboard/Profile';
import DashPosts from '@/components/dashboard/DashPosts';
import DashUsers from '@/components/dashboard/DashUsers';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
	const location = useLocation();

	const urlSearchParams = new URLSearchParams(location.search);
	const tab = urlSearchParams.get('tab');

	return (
		<div className="flex border">
			<DashSidebar />
			{/* Profile */}
			{tab == 'profile' && <Profile />}
			{/* Posts */}
			{tab == 'posts' && <DashPosts />}
			{/* Users */}
			{tab == 'users' && <DashUsers />}
		</div>
	);
}
