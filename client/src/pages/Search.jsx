import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '@/api/axiosInstance';
import PostCard from '@/components/common/PostCard';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function Search() {
	const [sidebarData, setSidebarData] = useState({
		keyword: '',
		sort: 'desc',
		category: 'uncategorized',
	});
	// console.log('sidebarData', sidebarData);

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const searchQuery = new URLSearchParams(location.search);
		const keywordFromUrl = searchQuery.get('keyword');
		const sortFromUrl = searchQuery.get('sort');
		const categoryFromUrl = searchQuery.get('category');

		if (keywordFromUrl || sortFromUrl || categoryFromUrl) {
			// console.log('sortFromUrl', sortFromUrl);
			// console.log('categoryFromUrl', categoryFromUrl);
			// console.log('keywordFromUrl', keywordFromUrl);

			setSidebarData((prev) => ({
				...prev,
				keyword: keywordFromUrl || '',
				sort: sortFromUrl || 'desc',
				category: categoryFromUrl || 'uncategorized',
			}));
		}

		const fetchPosts = async () => {
			setLoading(true);
			// const res = await fetch(
			// 	`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?${searchQuery}`,
			// );
			const res = await api.get(`/post/getposts?${searchQuery.toString()}`);

			try {
				const data = res.data;

				setPosts(data.posts);
				setLoading(false);

				if (data.posts.length === 9) {
					setShowMore(true);
				} else {
					setShowMore(false);
				}
			} catch (error) {
				setLoading(false);
				console.error(error);
				return;
			}
		};
		fetchPosts();
	}, [location.search]);

	const handleChange = (name, value) => {
		setSidebarData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const searchQuery = new URLSearchParams(location.search);
		searchQuery.set('keyword', sidebarData.keyword);
		searchQuery.set('sort', sidebarData.sort);
		searchQuery.set('category', sidebarData.category);
		navigate(`/search?${searchQuery.toString()}`);
	};

	const handleShowMore = async () => {
		const numberOfPosts = posts.length;
		const startIndex = numberOfPosts;
		const searchQuery = new URLSearchParams(location.search);
		searchQuery.set('startIndex', startIndex);
		const res = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?${searchQuery.toString()}`,
		);
		if (!res.ok) {
			return;
		}
		if (res.ok) {
			const data = await res.json();
			setPosts([...posts, ...data.posts]);
			if (data.posts.length === 9) {
				setShowMore(true);
			} else {
				setShowMore(false);
			}
		}
	};

	return (
		<div className="flex flex-col md:flex-row">
			{/* Search and filters */}
			<div className="p-7 md:min-h-screen md:border-r">
				<form className="flex flex-col gap-8" onSubmit={handleSubmit}>
					{/* Keyword */}
					<div className="flex items-center gap-2">
						<label htmlFor="keyword" className="font-semibold whitespace-nowrap">
							Search Term:
						</label>
						<Input
							placeholder="Search..."
							type="text"
							value={sidebarData.keyword}
							onChange={(e) => handleChange('keyword', e.target.value)}
						/>
					</div>

					{/* Sort by */}
					<div className="flex items-center gap-2">
						<label className="font-semibold">Sort:</label>
						<Select value={sidebarData.sort} onValueChange={(value) => handleChange('sort', value)}>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="desc">Latest</SelectItem>
									<SelectItem value="asc">Oldest</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* Category */}
					<div className="flex items-center gap-2">
						<label className="font-semibold">Category:</label>
						<Select
							value={sidebarData.category}
							onValueChange={(value) => handleChange('category', value)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="uncategorized">Uncategorized</SelectItem>
									<SelectItem value="javascript">Javascript</SelectItem>
									<SelectItem value="reactjs">ReactJs</SelectItem>
									<SelectItem value="nextjs">NextJs</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<Button type="submit">Apply Filters</Button>
				</form>
			</div>

			{/* Cards */}
			<div className="flex-1">
				<h1 className="mt-5 border-gray-600 p-3 text-3xl font-semibold sm:border-b">
					Posts results:
				</h1>
				<div className="mx-auto grid w-fit grid-cols-1 gap-4 p-7 lg:grid-cols-3">
					{!loading && posts.length === 0 && (
						<p className="text-xl text-gray-500">No posts found.</p>
					)}
					{loading && <p className="text-xl text-gray-500">Loading...</p>}
					{!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
					{showMore && (
						<button
							onClick={handleShowMore}
							className="w-full p-7 text-lg text-teal-500 hover:underline"
						>
							Show More
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
