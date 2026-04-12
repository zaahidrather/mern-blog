import { useLocation } from 'react-router-dom';
import DashSidebar from '@/components/dashboard/DashSidebar';
import Profile from '@/components/dashboard/Profile';
import DashPosts from '@/components/dashboard/DashPosts';
import DashUsers from '@/components/dashboard/DashUsers';
import DashComments from '@/components/dashboard/DashComments';
import DashHome from '@/components/dashboard/DashHome';

export default function Dashboard() {
	const location = useLocation();

	const urlSearchParams = new URLSearchParams(location.search);
	const tab = urlSearchParams.get('tab');

	return (
		<div className="flex">
			<DashSidebar />
			{tab == 'home' && <DashHome />}
			{tab == 'profile' && <Profile />}
			{tab == 'posts' && <DashPosts />}
			{tab == 'users' && <DashUsers />}
			{tab == 'comments' && <DashComments />}
		</div>
	);
}
