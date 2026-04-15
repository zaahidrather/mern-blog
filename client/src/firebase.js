export const getFirebaseApp = async () => {
	const { initializeApp } = await import('firebase/app');

	// Your web app's Firebase configuration
	const firebaseConfig = {
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
		authDomain: 'mern-blog-ec8f4.firebaseapp.com',
		projectId: 'mern-blog-ec8f4',
		storageBucket: 'mern-blog-ec8f4.firebasestorage.app',
		messagingSenderId: '55276223724',
		appId: '1:55276223724:web:e2616d755a49579f1fb9c9',
	};

	// Initialize Firebase
	return initializeApp(firebaseConfig);
};
