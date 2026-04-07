import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '@/components/common/OAuth.jsx';

export default function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { loading, error: errorMessage } = useSelector((state) => state.user);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			return dispatch(signInFailure('Please fillout all fields.'));
		}

		const payload = {
			email,
			password,
		};

		try {
			dispatch(signInStart());

			const res = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const data = await res.json();
			// console.log('user login data', data);

			if (!res.ok) {
				throw new Error(data.message || 'Request failed');
			}

			dispatch(signInSuccess(data));
			navigate('/');
		} catch (error) {
			// For catching errors on client side like no-internet problem
			dispatch(signInFailure(error.message));
		}
	};

	return (
		<div className="mx-auto min-h-screen max-w-3xl gap-5 p-3 md:flex md:flex-row md:items-center">
			{/* Left */}
			<div className="flex-1">
				{/* Logo */}
				<Link
					to="/"
					className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white"
				>
					<span className="rounded-lg bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-white">
						Zahid's
					</span>
					Blog
				</Link>
				<div>
					<p className="mt-5 text-sm">
						Start writing blogs, share knowledge, and join a community of readers and writers
						exploring meaningful content.
					</p>
				</div>
			</div>
			{/* Right */}
			<div className="mt-5 flex-1 md:mt-0">
				<form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
					{/* Email */}
					<div className="relative">
						<Input
							className="peer focus:placeholder:text-transparent"
							type="email"
							id="email"
							placeholder="abc@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value.trim())}
						/>
						<label
							className="absolute -top-4 left-2 hidden rounded bg-white px-2 py-1 text-xs peer-focus:block"
							htmlFor="email"
						>
							Email <span className="font-bold text-red-500">*</span>
						</label>
					</div>
					{/* Password */}
					<div className="relative">
						<Input
							className="peer focus:placeholder:text-transparent"
							type="Password"
							id="password"
							placeholder="******"
							value={password}
							onChange={(e) => setPassword(e.target.value.trim())}
						/>
						<label
							className="absolute -top-4 left-2 hidden rounded bg-white px-2 py-1 text-xs peer-focus:block"
							htmlFor="password"
						>
							Password <span className="font-bold text-red-500">*</span>
						</label>
					</div>

					<Button size="lg" disabled={loading}>
						{loading ? (
							<>
								<Spinner /> <span>Signing In</span>
							</>
						) : (
							'Sign In'
						)}
					</Button>
					<OAuth />

					<div className="flex gap-x-2 text-sm">
						<span>Don't have an account?</span>
						<Link to="/sign-up" className="text-blue-500">
							Sign Up
						</Link>
					</div>
				</form>

				{errorMessage && (
					<Alert className="mt-5" variant="destructive">
						<AlertCircleIcon />
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				)}
			</div>
		</div>
	);
}
