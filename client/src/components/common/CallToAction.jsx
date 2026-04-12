import { Button } from '../ui/button';
import React from 'react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-teal-500/30 bg-slate-950 shadow-2xl md:flex-row">
			{/* Left Column: Content specific to your Blog Post */}
			<div className="flex flex-1 flex-col justify-center p-10 text-left md:p-14">
				<h2 className="font-serif text-3xl leading-tight font-light text-white md:text-5xl">
					Master the <span className="font-semibold text-teal-400">2026 Web</span> Ecosystem.
				</h2>

				<p className="mt-6 text-base leading-relaxed text-slate-400">
					The lines between Frontend and Backend have blurred. Learn to build adaptive frameworks
					that leverage Edge Functions and Streaming HTML for the modern era.
				</p>

				<div className="mt-10 flex flex-wrap items-center gap-4">
					{/* Primary Action */}
					<Button className="group flex items-center gap-3 rounded-full bg-teal-500 px-8 py-3 font-bold text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:scale-105 hover:bg-teal-400">
						<a href="https://react.dev" target="_blank" rel="noopener noreferrer">
							Explore React Docs
						</a>
						<span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
							→
						</span>
					</Button>

					{/* Secondary Action */}
					<Button
						variant="ghost"
						className="rounded-full border border-slate-700 px-8 py-3 text-white transition-colors hover:bg-slate-800"
					>
						<Link to="/search?category=Development">View Roadmap</Link>
					</Button>
				</div>
			</div>

			{/* Right Column: Aesthetic Radial Design */}
			<div className="relative flex-1 self-stretch overflow-hidden bg-slate-900">
				{/* Concentric Circles mimicking your reference image */}
				<div className="absolute top-1/2 -right-20 h-[500px] w-[500px] -translate-y-1/2 rounded-full border border-teal-500/20" />
				<div className="absolute top-1/2 -right-10 h-[400px] w-[400px] -translate-y-1/2 rounded-full border border-teal-500/15" />
				<div className="absolute top-1/2 right-0 h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-teal-500/10" />
				<div className="absolute top-1/2 right-10 h-[200px] w-[200px] -translate-y-1/2 rounded-full border border-teal-500/5" />

				{/* Glowing Core */}
				<div className="absolute top-1/2 -right-10 h-32 w-32 -translate-y-1/2 rounded-full bg-teal-500/20 blur-3xl" />
			</div>
		</div>
	);
}
