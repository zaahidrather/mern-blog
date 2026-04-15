import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
	return (
		<div className="group w-full overflow-hidden rounded-lg border border-teal-500/30 transition-all hover:border-2 hover:border-teal-500/60">
			<Link to={`/post/${post.slug}`}>
				<img src={post.image} alt="post cover" className="z-20 h-[230px] w-full object-cover" />
			</Link>
			<div className="flex flex-col gap-2 p-3">
				<p className="line-clamp-2 text-lg font-semibold">{post.title}</p>
				<span className="text-sm italic">{post.category}</span>
				<Link
					to={`/post/${post.slug}`}
					className="my-2 rounded-md border border-teal-500 py-2 text-center text-teal-500 transition-all duration-300 hover:bg-teal-500 hover:text-white"
				>
					Read article
				</Link>
			</div>
		</div>
	);
}
