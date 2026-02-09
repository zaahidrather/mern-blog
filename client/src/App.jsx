import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import AuthRoute from './components/common/AuthRoute.jsx';
import CreatePost from './pages/CreatePost.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';

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
					path: '/projects',
					Component: Projects,
				},
				{
					Component: AuthRoute,
					children: [
						{
							path: '/sign-up',
							Component: SignUp,
						},
						{
							path: '/sign-in',
							Component: SignIn,
						},
					],
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
				{
					Component: AdminRoute,
					children: [
						{
							path: '/create-post',
							Component: CreatePost,
						},
					],
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
