import DashSidebar from '@/components/dashboard/DashSidebar';
import Profile from '@/components/dashboard/Profile';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
	const location = useLocation();

	const urlSearchParams = new URLSearchParams(location.search);
	const tab = urlSearchParams.get('tab');

	return (
		<div className="flex border">
			<DashSidebar />
			{tab == 'profile' && <Profile />}
		</div>
	);
}
