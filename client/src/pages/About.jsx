import React from 'react';
import { BookOpen, Users, Zap, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function About() {
	return (
		<main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
			{/* Hero Section */}
			<section className="mx-auto max-w-6xl px-6 py-20 lg:flex lg:items-center lg:gap-12">
				<div className="lg:w-1/2">
					<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
						Sharing knowledge for the{' '}
						<span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
							modern web.
						</span>
					</h1>
					<p className="mb-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
						Welcome to Zahid's Blog. This platform was born out of a passion for full-stack
						development and the desire to simplify complex technical concepts for developers
						worldwide.
					</p>
					<p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
						We encourage you to leave comments on our posts and engage with other readers. You can
						like other people's comments and reply to them as well. We believe that a community of
						learners can help each other grow and improve.
					</p>
					<div className="flex gap-4">
						<Link to="/search" className="bg-red- rounded-full" title="View all posts">
							<Button size="lg" variant="outline" className="rounded-full px-8">
								View Posts
							</Button>
						</Link>
					</div>
				</div>

				<div className="mt-12 lg:mt-0 lg:w-1/2">
					<div className="aspect-square overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
						<img
							src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
							alt="Workspace"
							className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
						/>
					</div>
				</div>
			</section>

			<hr className="mx-auto max-w-6xl border-slate-200 dark:border-slate-800" />

			{/* Values/Features Section */}
			<section className="mx-auto max-w-6xl px-6 py-20">
				<div className="mb-16 text-center">
					<h2 className="text-3xl font-bold sm:text-4xl">Why I started this blog</h2>
					<p className="mt-4 text-slate-600 dark:text-slate-400">
						Three pillars that drive every article I write.
					</p>
				</div>

				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<div className="rounded-2xl border border-slate-200 p-8 transition-colors hover:border-indigo-500/50 dark:border-slate-800">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
							<Zap size={24} />
						</div>
						<h3 className="mb-2 text-xl font-bold">Fast Learning</h3>
						<p className="text-slate-600 dark:text-slate-400">
							No fluff. Just straight-to-the-point tutorials designed to get you up and running
							quickly.
						</p>
					</div>

					<div className="rounded-2xl border border-slate-200 p-8 transition-colors hover:border-purple-500/50 dark:border-slate-800">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
							<Users size={24} />
						</div>
						<h3 className="mb-2 text-xl font-bold">Community Driven</h3>
						<p className="text-slate-600 dark:text-slate-400">
							A space where developers can discuss, comment, and grow together through shared
							experiences.
						</p>
					</div>

					<div className="rounded-2xl border border-slate-200 p-8 transition-colors hover:border-pink-500/50 dark:border-slate-800">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
							<BookOpen size={24} />
						</div>
						<h3 className="mb-2 text-xl font-bold">In-Depth Guides</h3>
						<p className="text-slate-600 dark:text-slate-400">
							From MERN stack architecture to CSS design tokens, we dive deep into the tech we love.
						</p>
					</div>
				</div>
			</section>

			{/* Social/Connect Section */}
			<section className="bg-slate-50 py-20 dark:bg-slate-900/50">
				<div className="mx-auto max-w-4xl px-6 text-center">
					<h2 className="mb-6 text-3xl font-bold">Let's connect</h2>
					<p className="mb-10 text-slate-600 dark:text-slate-400">
						I'm always open to discussing new projects, creative ideas, or opportunities to be part
						of your vision.
					</p>
					<div className="flex justify-center gap-6">
						<a href="#" className="text-slate-500 transition-colors hover:text-indigo-500">
							<Github size={28} />
						</a>
						<a href="#" className="text-slate-500 transition-colors hover:text-blue-400">
							<Twitter size={28} />
						</a>
						<a href="#" className="text-slate-500 transition-colors hover:text-blue-700">
							<Linkedin size={28} />
						</a>
					</div>
				</div>
			</section>
		</main>
	);
}
