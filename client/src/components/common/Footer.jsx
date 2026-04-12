import { Link } from 'react-router-dom';
import logo_1 from '@/assets/logo_1.png';

import { Facebook, Instagram, Twitter, Github, Dribbble } from 'lucide-react';

export default function Footer() {
	return (
		<footer className="border-t-8 border-[#0e7490]">
			<div className="mx-auto max-w-7xl px-4 py-8">
				{/* Top */}
				<div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
					{/* Brand */}
					<Link
						to="/"
						className="self-center text-sm font-semibold whitespace-nowrap md:text-base dark:text-white"
					>
						<img src={logo_1} className="h-10" alt="Logo" />
					</Link>

					{/* Links */}
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
						<div>
							<h3 className="mb-4 text-sm font-semibold uppercase">About</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>
									<a href="/about">Zahid&apos;s Blog</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 text-sm font-semibold uppercase">Follow us</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>
									<a
										href="https://github.com/zaahidrather"
										target="_blank"
										rel="noopener noreferrer"
									>
										Github
									</a>
								</li>
								<li>
									<a href="#">Discord</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 text-sm font-semibold uppercase">Legal</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>
									<a href="#">Privacy Policy</a>
								</li>
								<li>
									<a href="#">Terms &amp; Conditions</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Divider */}
				<hr className="my-6 border-gray-200 dark:border-gray-700" />

				{/* Bottom */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						© {new Date().getFullYear()} Zahid&apos;s Blog
					</p>

					<div className="flex gap-5">
						<a href="#" aria-label="Facebook">
							<Facebook size={18} />
						</a>
						<a href="https://https://www.instagram.com/zaahidrather/" aria-label="Instagram">
							<Instagram size={18} />
						</a>
						<a href="#" aria-label="Twitter">
							<Twitter size={18} />
						</a>
						<a href="https://github.com/zaahidrather" aria-label="Github">
							<Github size={18} />
						</a>
						<a href="#" aria-label="Dribbble">
							<Dribbble size={18} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
