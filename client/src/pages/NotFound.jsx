import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, MoveLeft } from 'lucide-react';

export default function NotFound() {
	return (
		<div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
			{/* Background Decorative Element */}
			<div className="absolute -z-10 h-64 w-64 rounded-full bg-gradient-to-r from-[#8c56ff]/10 to-[#0e7490]/10 blur-3xl" />

			<h1 className="text-9xl font-extrabold tracking-tight text-gray-200 dark:text-gray-800">
				404
			</h1>

			<div className="mt-[-2rem]">
				<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
					Lost in the digital woods?
				</h2>
				<p className="text-muted-foreground mt-4 text-lg">
					The page you’re looking for doesn’t exist or has been moved to a new home.
				</p>
			</div>

			<div className="mt-10 flex flex-col gap-4 sm:flex-row">
				<Button asChild variant="default" className="gap-2 px-8 py-6 text-lg shadow-lg">
					<Link to="/">
						<HomeIcon size={20} />
						Back to Home
					</Link>
				</Button>

				<Button asChild variant="ghost" className="gap-2 px-8 py-6 text-lg">
					<Link to={-1}>
						<MoveLeft size={20} />
						Go Back
					</Link>
				</Button>
			</div>

			{/* <p className="text-muted-foreground mt-12 text-sm">
				If you think this is a mistake, please{' '}
				<Link to="/contact" className="hover:text-primary underline">
					report it
				</Link>
				.
			</p> */}
		</div>
	);
}
