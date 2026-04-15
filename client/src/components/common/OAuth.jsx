import React from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '@/redux/user/userSlice.js';

export default function OAuth() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleGoogleClick = async () => {
		try {
			dispatch(signInStart());

			// Firebase loaded ONLY when button clicked
			// Dynamically import the Auth functions
			const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
			// Dynamically import your Firebase config function
			const { getFirebaseApp } = await import('@/firebase');

			// Initialize and use
			const firebaseApp = await getFirebaseApp();
			const auth = getAuth(firebaseApp);
			const provider = new GoogleAuthProvider();
			provider.setCustomParameters({ prompt: 'select_account' });

			const resultsFromGoogle = await signInWithPopup(auth, provider);
			// console.log("resultsFromGoogle", resultsFromGoogle);
			const idToken = await resultsFromGoogle.user.getIdToken();

			const res = await fetch('/api/auth/google', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ idToken }),
			});

			const data = await res.json();
			// console.log('res', res);
			// console.log("Backend response data:", data);

			if (!res.ok) {
				console.log('Google login failed:', data);
				dispatch(signInFailure('Google sign-in failed. Please try again.'));
				return;
			}

			dispatch(signInSuccess(data));
			navigate('/');
		} catch (error) {
			console.log(error);

			// If the error is from Firebase Auth (closing the popup)
			if (error.code === 'auth/popup-closed-by-user' || error.message?.includes('closed-by-user')) {
				dispatch(signInFailure(null)); // Quietly stop loading
			} else {
				// Handle actual errors (network issues, etc.)
				dispatch(signInFailure(error.message || 'An error occurred during Google sign-in.'));
			}
		}
	};

	return (
		<Button
			type="button"
			onClick={handleGoogleClick}
			className="flex items-center border-2 border-purple-500 font-medium"
			variant="outline"
		>
			<svg
				width="24px"
				height="24px"
				viewBox="0 0 1024 1024"
				xmlns="http://www.w3.org/2000/svg"
				className="icon fill-current transition-colors dark:text-white"
			>
				<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm167 633.6C638.4 735 583 757 516.9 757c-95.7 0-178.5-54.9-218.8-134.9C281.5 589 272 551.6 272 512s9.5-77 26.1-110.1c40.3-80.1 123.1-135 218.8-135 66 0 121.4 24.3 163.9 63.8L610.6 401c-25.4-24.3-57.7-36.6-93.6-36.6-63.8 0-117.8 43.1-137.1 101-4.9 14.7-7.7 30.4-7.7 46.6s2.8 31.9 7.7 46.6c19.3 57.9 73.3 101 137 101 33 0 61-8.7 82.9-23.4 26-17.4 43.2-43.3 48.9-74H516.9v-94.8h230.7c2.9 16.1 4.4 32.8 4.4 50.1 0 74.7-26.7 137.4-73 180.1z" />
			</svg>
			Continue with Google
		</Button>
	);
}
