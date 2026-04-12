import logo_1 from '@/assets/logo_1.png';
import logo_2 from '@/assets/logo_2.png';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { themeToggle } from '@/redux/theme/themeSlice';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '@/redux/user/userSlice';

export default function Header() {
	const { pathname } = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);
	const theme = useSelector((state) => state.theme.mode);

	// console.log('theme mode : ', theme);
	// console.log('currentUser', currentUser);

	const isActive = (href) =>
		`  px-3 py-2 text-sm font-semibold transition-colors ${
			pathname === href
				? ' text-white bg-[#0e7490]'
				: 'text-muted-foreground  hover:text-foreground'
		}`;

	async function handleSignout() {
		try {
			const res = await fetch('/api/user/signout', {
				method: 'POST',
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signoutSuccess());
			}
		} catch (error) {
			console.log('failed to signout', error);
		}
	}

	return (
		<header className="dark:bg-black">
			<div
				className={`flex justify-between ${
					isOpen ? 'border-b-0' : 'border-b-2'
				} px-4 py-2.5 lg:px-6`}
			>
				{/* <span className="rounded-lg bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-white">
					Zahid's
				</span>
				Blog */}
				<Link
					to="/"
					className="self-center text-sm font-semibold whitespace-nowrap md:text-base dark:text-white"
				>
					<img src={logo_1} className="h-10" alt="Logo" />
				</Link>
				<form>
					<div className="relative hidden lg:inline-block">
						<Input type="text" placeholder="Search..." className="pr-9" />
						<Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
					</div>
				</form>

				<Button
					variant="primary"
					size="icon"
					className="h-10 w-12 cursor-pointer rounded-full border lg:hidden"
				>
					<Search className="h-4 w-4" />
				</Button>

				<div className="flex items-center gap-2 md:order-2">
					{/* Light / Dark mode button */}
					<button
						className="hidden h-10 w-12 cursor-pointer items-center justify-center rounded-full border bg-white text-black md:flex"
						color="gray"
						onClick={() => dispatch(themeToggle())}
					>
						{theme == 'dark' ? <Moon /> : <Sun />}
					</button>

					{currentUser ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<img
									src={currentUser.avatar?.secure_url}
									onError={(e) => {
										e.target.src =
											'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
									}}
									alt="User avatar"
									referrerPolicy="no-referrer"
									className="h-10 w-10 cursor-pointer rounded-full object-cover"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								{/* Header Section */}
								<div className="px-2 py-1.5">
									<p className="text-sm font-medium">@{currentUser.username}</p>
									<p className="text-muted-foreground truncate text-xs">{currentUser.email}</p>
								</div>

								<DropdownMenuSeparator />

								<DropdownMenuItem asChild>
									<Link className="cursor-pointer" to={'/dashboard?tab=profile'}>
										Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleSignout}>Sign out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link to="/sign-in">
							<Button variant="outline">Sign In</Button>
						</Link>
					)}

					{/* Hamburger Icon Mobile */}
					<div>
						<button className="flex h-10 w-10 cursor-pointer items-center justify-center border md:hidden">
							<Menu onClick={() => setIsOpen((v) => !v)} className="h-6 w-6" />
						</button>
					</div>
				</div>

				{/* Nav Links - Pc */}
				<nav className="hidden gap-1 whitespace-nowrap md:flex lg:gap-2">
					<Link to="/" className={isActive('/')}>
						Home
					</Link>
					<Link to="/about" className={isActive('/about')}>
						About
					</Link>
					<Link to="/projects" className={isActive('/projects')}>
						Projects
					</Link>
				</nav>
			</div>

			{/* Nav Links - Mobile */}
			{isOpen && (
				<nav className="flex-col gap-1 border-b-2 [&>a]:block [&>a]:font-medium">
					<Link to="/" className={isActive('/')}>
						Home
					</Link>
					<Link to="/about" className={isActive('/about')}>
						About
					</Link>
					<Link to="/projects" className={isActive('/projects')}>
						Projects
					</Link>
				</nav>
			)}
		</header>
	);
}
