import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Static Imports (Loaded immediately for fast FCP)
import Root from './pages/Root.jsx';
import Home from './pages/Home.jsx';

// Components used for logic/wrapping should remain static
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AuthRoute from './components/common/AuthRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';
import Loader from './components/common/Loader.jsx';

// Lazy Loaded Routes (Split into separate chunks)
const About = lazy(() => import('./pages/About.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const SignIn = lazy(() => import('./pages/SignIn.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const CreatePost = lazy(() => import('./pages/CreatePost.jsx'));
const UpdatePost = lazy(() => import('./pages/UpdatePost.jsx'));
const PostPage = lazy(() => import('./pages/PostPage.jsx'));

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
					path: '/post/:postSlug',
					Component: PostPage,
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
						{
							path: '/update-post/:postId',
							Component: UpdatePost,
						},
					],
				},
			],
		},
	]);

	return (
		<Suspense fallback={<Loader />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}

export default App;
