import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Outlet, ScrollRestoration } from 'react-router-dom';

export default function Root() {
	const theme = useSelector((state) => state.theme.mode);
	return (
		<>
			<ScrollRestoration />
			<Header />
			<Toaster
				toastOptions={{
					style: {
						background: theme === 'dark' ? '#333' : '#fff',
						color: theme === 'dark' ? '#fff' : '#333',
					},
				}}
				position="top-right"
				reverseOrder={false}
			/>
			<Outlet />
			<Footer />
		</>
	);
}
