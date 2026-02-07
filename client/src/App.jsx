import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';

function App() {
	const router = createBrowserRouter([
		{
			Component: Root,
			children: [
				{
					path: '/',
					Component: Home,
				},
				{
					path: '/about',
					Component: About,
				},
				{
					path: '/sign-up',
					Component: SignUp,
				},
				{
					path: '/sign-in',
					Component: SignIn,
				},
				{
					path: '/projects',
					Component: Projects,
				},
				{
					Component: ProtectedRoute,
					children: [
						{
							path: '/dashboard',
							Component: Dashboard,
						},
					],
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
